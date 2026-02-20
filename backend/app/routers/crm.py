from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.database import get_db
from app.models import ActivityLog, CustomerNote, CustomerTag, Order, Ticket, User
from app.schemas.crm import (
    ActivityLogResponse,
    CustomerNoteCreate,
    CustomerNoteResponse,
    CustomerSummary,
    CustomerTagCreate,
    CustomerTagResponse,
    DashboardStats,
)
from app.schemas.order import OrderWithProductResponse
from app.schemas.ticket import TicketResponse
from app.utils.activity import log_activity

router = APIRouter(prefix="/api/admin", tags=["crm"])

# --- Dashboard Stats ---


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db), admin: str = Depends(get_current_admin)
):
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    open_tickets = db.query(Ticket).filter(Ticket.status == "open").count()

    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    new_customers = db.query(User).filter(User.created_at >= seven_days_ago).count()

    # "Follow up needed": Customers with tags like 'follow-up' or similar
    # For now, let's say tagged with 'Follow Up'
    follow_up_needed = (
        db.query(CustomerTag).filter(CustomerTag.tag == "Follow Up").count()
    )

    return DashboardStats(
        pending_orders=pending_orders,
        open_tickets=open_tickets,
        new_customers_7d=new_customers,
        follow_up_needed=follow_up_needed,
    )


# --- Customers ---


@router.get("/customers", response_model=list[CustomerSummary])
def list_customers(
    search: str = Query(None),
    tag: str = Query(None),
    sort: str = Query("activity"),  # activity, spend, orders
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    query = db.query(User)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (User.email.ilike(search_term)) | (User.full_name.ilike(search_term))
        )

    if tag:
        query = query.join(CustomerTag).filter(CustomerTag.tag == tag)

    if sort == "newest":
        query = query.order_by(User.created_at.desc())
    else:
        query = query.order_by(User.created_at.desc())  # Default

    query.count()
    users = query.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for user in users:
        # Calculate spend properly
        total_spend = 0
        user_orders = db.query(Order).filter(Order.user_id == user.id).all()
        for o in user_orders:
            if o.product:
                total_spend += o.product.price_idr

        last_activity = (
            db.query(ActivityLog)
            .filter(ActivityLog.customer_id == user.id)
            .order_by(ActivityLog.created_at.desc())
            .first()
        )

        tags = [t.tag for t in user.tags]

        results.append(
            CustomerSummary(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                total_orders=len(user_orders),
                total_spend=total_spend,
                last_activity=last_activity.created_at
                if last_activity
                else user.created_at,
                tags=tags,
            )
        )

    return results


@router.get("/customers/{customer_id}", response_model=CustomerSummary)
def get_customer_summary(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == customer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_spend = 0
    user_orders = db.query(Order).filter(Order.user_id == user.id).all()
    for o in user_orders:
        if o.product:
            total_spend += o.product.price_idr

    last_activity = (
        db.query(ActivityLog)
        .filter(ActivityLog.customer_id == user.id)
        .order_by(ActivityLog.created_at.desc())
        .first()
    )

    tags = [t.tag for t in user.tags]

    return CustomerSummary(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        total_orders=len(user_orders),
        total_spend=total_spend,
        last_activity=last_activity.created_at if last_activity else user.created_at,
        tags=tags,
    )


@router.get(
    "/customers/{customer_id}/orders", response_model=list[OrderWithProductResponse]
)
def get_customer_orders(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == customer_id)
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
    return items


@router.get("/customers/{customer_id}/tickets", response_model=list[TicketResponse])
def get_customer_tickets(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return (
        db.query(Ticket)
        .filter(Ticket.user_id == customer_id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


# --- Tags ---


@router.get("/customers/{customer_id}/tags", response_model=list[CustomerTagResponse])
def get_customer_tags(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return db.query(CustomerTag).filter(CustomerTag.customer_id == customer_id).all()


@router.post("/customers/{customer_id}/tags", response_model=CustomerTagResponse)
def add_customer_tag(
    customer_id: int,
    tag_in: CustomerTagCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    exists = (
        db.query(CustomerTag)
        .filter(CustomerTag.customer_id == customer_id, CustomerTag.tag == tag_in.tag)
        .first()
    )
    if exists:
        return exists

    tag = CustomerTag(customer_id=customer_id, tag=tag_in.tag)
    db.add(tag)

    log_activity(db, customer_id, "tag_added", metadata={"tag": tag_in.tag})

    db.commit()
    db.refresh(tag)
    return tag


@router.delete("/customers/{customer_id}/tags/{tag_name}")
def remove_customer_tag(
    customer_id: int,
    tag_name: str,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    db.query(CustomerTag).filter(
        CustomerTag.customer_id == customer_id, CustomerTag.tag == tag_name
    ).delete()

    log_activity(db, customer_id, "tag_removed", metadata={"tag": tag_name})
    db.commit()
    return {"status": "ok"}


# --- Notes ---


@router.get("/customers/{customer_id}/notes", response_model=list[CustomerNoteResponse])
def get_customer_notes(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return (
        db.query(CustomerNote)
        .filter(CustomerNote.customer_id == customer_id)
        .order_by(CustomerNote.created_at.desc())
        .all()
    )


@router.post("/customers/{customer_id}/notes", response_model=CustomerNoteResponse)
def add_customer_note(
    customer_id: int,
    note_in: CustomerNoteCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    note = CustomerNote(
        customer_id=customer_id, note=note_in.note, created_by_admin=admin
    )
    db.add(note)

    log_activity(db, customer_id, "note_added")
    db.commit()
    db.refresh(note)
    return note


# --- Activity ---


@router.get(
    "/customers/{customer_id}/activity", response_model=list[ActivityLogResponse]
)
def get_customer_activity(
    customer_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return (
        db.query(ActivityLog)
        .filter(ActivityLog.customer_id == customer_id)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )
