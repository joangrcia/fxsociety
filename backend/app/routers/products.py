from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.database import get_db
from app.models import Product
from app.schemas import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/api/products", tags=["products"])


# --- Public Endpoints ---


@router.get("", response_model=ProductListResponse)
def list_products(
    category: str | None = Query(None, description="Filter by category"),
    search: str | None = Query(None, description="Search in title and description"),
    sort: str | None = Query(
        "newest", description="Sort: newest, price_asc, price_desc, name"
    ),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """List all active products with filtering, search, and pagination."""
    query = db.query(Product).filter(Product.is_active)

    # Filter by category
    if category:
        query = query.filter(Product.category == category)

    # Search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.title.ilike(search_term),
                Product.description_short.ilike(search_term),
            )
        )

    # Sort
    if sort == "price_asc":
        query = query.order_by(Product.price_idr.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price_idr.desc())
    elif sort == "name":
        query = query.order_by(Product.title.asc())
    else:  # newest (default)
        query = query.order_by(Product.created_at.desc())

    # Count total
    total = query.count()
    pages = ceil(total / page_size) if total > 0 else 1

    # Paginate
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.get("/{id_or_slug}", response_model=ProductResponse)
def get_product(
    id_or_slug: str,
    db: Session = Depends(get_db),
):
    """Get a single product by ID or slug."""
    # Try as ID first
    if id_or_slug.isdigit():
        product = (
            db.query(Product)
            .filter(
                Product.id == int(id_or_slug),
                Product.is_active,
            )
            .first()
        )
    else:
        product = None

    # Try as slug if not found by ID
    if not product:
        product = (
            db.query(Product)
            .filter(
                Product.slug == id_or_slug,
                Product.is_active,
            )
            .first()
        )

    if not product:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")

    return ProductResponse.model_validate(product)


# --- Admin Endpoints ---


@router.get("/admin/all", response_model=ProductListResponse)
def list_all_products_admin(
    search: str | None = Query(None, description="Search products"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: List all products (including inactive)."""
    query = db.query(Product)

    if search:
        search_term = f"%{search}%"
        query = query.filter(Product.title.ilike(search_term))

    query = query.order_by(Product.created_at.desc())

    total = query.count()
    pages = ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size
    products = query.offset(offset).limit(page_size).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.post("/admin", response_model=ProductResponse, status_code=201)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: Create new product."""
    if db.query(Product).filter(Product.slug == product_in.slug).first():
        raise HTTPException(status_code=400, detail="Slug sudah digunakan")

    product = Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.patch("/admin/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: Update product details."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)

    # Check slug uniqueness if changed
    if "slug" in update_data and update_data["slug"] != product.slug:
        if db.query(Product).filter(Product.slug == update_data["slug"]).first():
            raise HTTPException(status_code=400, detail="Slug already in use")

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.patch("/admin/{product_id}/toggle-active", response_model=ProductResponse)
def toggle_product_active(
    product_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    """Admin: Toggle product active status."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = not product.is_active
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)
