from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.database.db import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    image_url = Column(String(500))
    seller_id = Column(Integer, ForeignKey("users.id"))