from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description_short = Column(String(500), nullable=False)
    description_full = Column(Text, nullable=True)
    price_idr = Column(Integer, nullable=False)  # Price in IDR (no decimals)
    category = Column(
        String(50), nullable=False, index=True
    )  # indikator, robot, ebook, merchandise
    badges = Column(JSON, nullable=True)  # ["new", "popular", "bestseller"]
    images = Column(JSON, nullable=True)  # ["url1", "url2"]
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Product {self.slug}>"
