from datetime import datetime

from pydantic import BaseModel


class TicketCreate(BaseModel):
    title: str
    message: str


class TicketResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
