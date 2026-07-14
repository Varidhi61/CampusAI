from pydantic import BaseModel


class ProductCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str
    image_url: str | None = None


class ProductUpdate(BaseModel):
    title: str
    description: str
    price: float
    category: str


class ProductResponse(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    image_url: str | None = None
    seller_id: int | None = None

    class Config:
        from_attributes = True


# ===========================
# AI Price Negotiation Schemas
# ===========================

class NegotiationRequest(BaseModel):
    title: str
    category: str
    original_price: float
    buyer_offer: float


class NegotiationResponse(BaseModel):
    counter_offer: float
    reason: str