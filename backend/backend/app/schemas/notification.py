from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    message: str
    is_read: int

    class Config:
        from_attributes = True