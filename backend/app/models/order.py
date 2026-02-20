import secrets
import string

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


def generate_order_code() -> str:
    """Generate a unique order code like FXS-ABC123."""
    chars = string.ascii_uppercase + string.digits
    random_part = "".join(secrets.choice(chars) for _ in range(6))
    return f"FXS-{random_part}"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(
        String(20), unique=True, index=True, nullable=False, default=generate_order_code
    )
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Customer info
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False, index=True)
    whatsapp = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)

    # Status: pending, confirmed, completed, cancelled
    status = Column(String(20), default="pending", nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationship
    product = relationship("Product", backref="orders")
    user = relationship("User", backref="orders")

    def __repr__(self):
        return f"<Order {self.order_code}>"
