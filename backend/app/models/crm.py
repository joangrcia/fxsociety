from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class CustomerTag(Base):
    __tablename__ = "customer_tags"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    tag = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="tags")


class CustomerNote(Base):
    __tablename__ = "customer_notes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    note = Column(Text, nullable=False)
    created_by_admin = Column(String(100), nullable=False)  # Store admin username
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="notes")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(
        String(50), nullable=False
    )  # order_created, order_status, ticket_created, note_added, etc.
    reference_id = Column(String(50), nullable=True)  # order_code or ticket_id
    metadata_json = Column(JSON, nullable=True)  # Extra info
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="activities")
