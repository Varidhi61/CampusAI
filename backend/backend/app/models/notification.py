from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.db import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    is_read = Column(
        Integer,
        default=0
    )

