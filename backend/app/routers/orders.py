from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth import get_current_admin, get_current_user
from app.database import get_db
from app.models import Order, Product, User
from app.schemas import (
    OrderCreate,
    OrderListResponse,
    OrderResponse,
    OrderStatusPublicResponse,
    OrderWithProductResponse,
)
from app.utils.activity import log_activity

router = APIRouter(prefix="/api/orders", tags=["orders"])


# --- Public Endpoints ---


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    """Create a new order. Status defaults to 'pending'."""
    # Verify product exists and is active
    product = (
        db.query(Product)
        .filter(
            Product.id == order_data.product_id,
            Product.is_active,
        )
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")

    # Check if user exists with this email to link automatically
    user = db.query(User).filter(User.email == order_data.email).first()

    # Create order
    order = Order(
        product_id=order_data.product_id,
        user_id=user.id if user else None,
        name=order_data.name,
        email=order_data.email,
        whatsapp=order_data.whatsapp,
        notes=order_data.notes,
        status="pending",
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    if user:
        log_activity(
            db,
            user.id,
            "order_created",
            reference_id=order.order_code,
            metadata={"product": product.title, "price": product.price_idr},
        )
        db.commit()  # Commit log

    return OrderResponse.model_validate(order)


@router.get("/me", response_model=OrderListResponse)
def list_my_orders(
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user),
):
    """Get authenticated user's orders."""
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    orders = (
        db.query(Order)
        .filter(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    items = [
        OrderWithProductResponse(
            id=o.id,
            order_code=o.order_code,
            product_id=o.product_id,
            name=o.name,
            email=o.email,
            whatsapp=o.whatsapp,
            notes=o.notes,
            status=o.status,
            created_at=o.created_at,
            updated_at=o.updated_at,
            product_title=o.product.title,
            product_price=o.product.price_idr,
            product_category=o.product.category,
            product_slug=o.product.slug,
            product_image=o.product.images[0]
            if o.product.images and len(o.product.images) > 0
            else None,
        )
        for o in orders
    ]

    return OrderListResponse(items=items, total=len(items))


@router.get("/{order_code}", response_model=OrderStatusPublicResponse)
def get_order_status(
    order_code: str,
    db: Session = Depends(get_db),
):
    """Get order status by order code (public lookup - no PII exposed).

    Returns only: order_code, status, product info, created_at.
    For full order details, use /me endpoint with authentication.
    """
    order = db.query(Order).filter(Order.order_code == order_code.upper()).first()

    if not order:
        raise HTTPException(status_code=404, detail="Pesanan tidak ditemukan")

    return OrderStatusPublicResponse(
        order_code=order.order_code,
        status=order.status,
        product_title=order.product.title,
        product_price=order.product.price_idr,
        product_category=order.product.category,
        created_at=order.created_at,
    )


# REMOVED: Public email-based order lookup (security risk - exposes PII)
# Use /api/orders/me with authentication instead.
# Legacy endpoint removed to prevent email enumeration attacks.


# --- Admin Endpoints ---


@router.get("/admin/all", response_model=OrderListResponse)
def list_all_orders_admin(
    status: str | None = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: List all orders with pagination and filtering."""
    query = db.query(Order)

    if status and status != "all":
        query = query.filter(Order.status == status)

    total = query.count()

    orders = (
        query.order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    items = [
        OrderWithProductResponse(
            id=o.id,
            order_code=o.order_code,
            product_id=o.product_id,
            name=o.name,
            email=o.email,
            whatsapp=o.whatsapp,
            notes=o.notes,
            status=o.status,
            created_at=o.created_at,
            updated_at=o.updated_at,
            product_title=o.product.title,
            product_price=o.product.price_idr,
            product_category=o.product.category,
            product_slug=o.product.slug,
            product_image=o.product.images[0]
            if o.product.images and len(o.product.images) > 0
            else None,
        )
        for o in orders
    ]

    return OrderListResponse(items=items, total=total)


class OrderStatusUpdate(BaseModel):
    status: str


@router.patch("/admin/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    update_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: Update order status."""
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if update_data.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status tidak valid. Gunakan: {', '.join(valid_statuses)}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order tidak ditemukan")

    old_status = order.status
    order.status = update_data.status
    db.commit()
    db.refresh(order)

    if order.user_id:
        log_activity(
            db,
            order.user_id,
            "order_status_updated",
            reference_id=order.order_code,
            metadata={"old_status": old_status, "new_status": update_data.status},
        )
        db.commit()

    return OrderResponse.model_validate(order)
