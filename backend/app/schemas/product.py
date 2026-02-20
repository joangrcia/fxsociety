from datetime import datetime

from pydantic import BaseModel


class ProductBase(BaseModel):
    title: str
    slug: str
    description_short: str
    description_full: str | None = None
    price_idr: int
    category: str
    badges: list[str] | None = None
    images: list[str] | None = None
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    description_short: str | None = None
    description_full: str | None = None
    price_idr: int | None = None
    category: str | None = None
    badges: list[str] | None = None
    images: list[str] | None = None
    is_active: bool | None = None


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
