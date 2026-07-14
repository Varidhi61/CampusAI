from sqlalchemy import Column, Integer, Float, String, ForeignKey, Date, Time
from app.database.db import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False
    )

    buyer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    seller_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    offered_price = Column(
        Float,
        nullable=False
    )

    counter_price = Column(
        Float,
        nullable=True
    )

    status = Column(
        String,
        default="Pending"
    )
    
    meeting_date = Column(
    Date,
    nullable=True
    )

    meeting_time = Column(
    Time,
    nullable=True
    )

    meeting_place = Column(
    String,
    nullable=True
    )

    custom_place = Column(
    String,
    nullable=True
    )