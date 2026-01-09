from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import Ticket, TicketStatus, User
from app.schemas.ticket import TicketCreate, TicketResponse, TicketListResponse
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.get("", response_model=TicketListResponse)
def list_my_tickets(
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    query = (
        db.query(Ticket)
        .filter(Ticket.user_id == user.id)
        .order_by(Ticket.updated_at.desc())
    )
    total = query.count()
    tickets = query.offset((page - 1) * page_size).limit(page_size).all()

    return TicketListResponse(
        items=[TicketResponse.model_validate(t) for t in tickets], total=total
    )


@router.post("", response_model=TicketResponse, status_code=201)
def create_ticket(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user),
):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    ticket = Ticket(
        user_id=user.id,
        title=ticket_in.title,
        message=ticket_in.message,
        status=TicketStatus.OPEN,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return TicketResponse.model_validate(ticket)


@router.get("/admin/all", response_model=TicketListResponse)
def list_all_tickets_admin(
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    query = db.query(Ticket)
    if status and status != "all":
        query = query.filter(Ticket.status == status)

    query = query.order_by(Ticket.updated_at.desc())
    total = query.count()
    tickets = query.offset((page - 1) * page_size).limit(page_size).all()

    return TicketListResponse(
        items=[TicketResponse.model_validate(t) for t in tickets], total=total
    )
