from datetime import datetime
from typing import Any

from pydantic import BaseModel


# Tags
class CustomerTagCreate(BaseModel):
    tag: str


class CustomerTagResponse(BaseModel):
    id: int
    customer_id: int
    tag: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Notes
class CustomerNoteCreate(BaseModel):
    note: str


class CustomerNoteResponse(BaseModel):
    id: int
    customer_id: int
    note: str
    created_by_admin: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Activity
class ActivityLogResponse(BaseModel):
    id: int
    customer_id: int
    type: str
    reference_id: str | None = None
    metadata_json: Any | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


# Customer Summary (for list)
class CustomerSummary(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    whatsapp: str | None = (
        None  # Derived from latest order or user profile if we add it
    )
    total_orders: int
    total_spend: int
    last_activity: datetime | None = None
    tags: list[str] = []

    model_config = {"from_attributes": True}


# Dashboard Stats
class DashboardStats(BaseModel):
    pending_orders: int
    open_tickets: int
    new_customers_7d: int
    follow_up_needed: int
