import re
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class OrderCreate(BaseModel):
    product_id: int
    name: str
    email: EmailStr
    whatsapp: str
    notes: str | None = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Nama tidak boleh kosong")
        return v.strip()

    @field_validator("whatsapp")
    @classmethod
    def validate_whatsapp(cls, v: str) -> str:
        # Remove spaces and dashes
        cleaned = re.sub(r"[\s\-]", "", v)

        # Must start with 0 or +62 or 62, followed by digits
        if not re.match(r"^(\+?62|0)[0-9]{9,13}$", cleaned):
            raise ValueError("Format nomor WhatsApp tidak valid")

        return cleaned


class OrderResponse(BaseModel):
    id: int
    order_code: str
    product_id: int
    name: str
    email: str
    whatsapp: str
    notes: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderWithProductResponse(OrderResponse):
    product_title: str
    product_price: int
    product_category: str | None = None
    product_slug: str | None = None
    product_image: str | None = None

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    items: list[OrderWithProductResponse]
    total: int


class OrderStatusPublicResponse(BaseModel):
    """Minimal order info for public lookup - no PII exposed."""

    order_code: str
    status: str
    product_title: str
    product_price: int
    product_category: str | None = None
    created_at: datetime
