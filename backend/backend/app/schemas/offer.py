from pydantic import BaseModel
from datetime import date, time

class OfferCreate(BaseModel):
    product_id: int
    offered_price: float


class CounterOfferRequest(BaseModel):
    counter_price: float
    
class MeetingScheduleRequest(BaseModel):
    meeting_date: date
    meeting_time: time
    meeting_place: str
    custom_place: str | None = None   


class OfferResponse(BaseModel):
    id: int
    product_id: int
    buyer_id: int
    seller_id: int
    offered_price: float
    counter_price: float | None = None
    status: str
    meeting_date: date | None = None
    meeting_time: time | None = None
    meeting_place: str | None = None
    custom_place: str | None = None
    class Config:
        from_attributes = True