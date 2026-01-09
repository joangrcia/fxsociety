from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    title: str
    slug: str
    description_short: str
    description_full: Optional[str] = None
    price_idr: int
    category: str
    badges: Optional[list[str]] = None
    images: Optional[list[str]] = None
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description_short: Optional[str] = None
    description_full: Optional[str] = None
    price_idr: Optional[int] = None
    category: Optional[str] = None
    badges: Optional[list[str]] = None
    images: Optional[list[str]] = None
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    pages: int
