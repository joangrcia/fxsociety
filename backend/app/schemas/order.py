from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re


class OrderCreate(BaseModel):
    product_id: int
    name: str
    email: EmailStr
    whatsapp: str
    notes: Optional[str] = None

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
    notes: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderWithProductResponse(OrderResponse):
    product_title: str
    product_price: int
    product_category: Optional[str] = None
    product_slug: Optional[str] = None
    product_image: Optional[str] = None

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
    product_category: Optional[str] = None
    created_at: datetime
