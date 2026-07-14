from fastapi import APIRouter, Depends, HTTPException
from app.models.notification import Notification
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.offer import Offer
from app.models.product import Product
from app.models.user import User
from app.schemas.offer import OfferCreate, OfferResponse,CounterOfferRequest,MeetingScheduleRequest
from app.utils.security import get_current_user

router = APIRouter(
    prefix="/offers",
    tags=["Offers"]
)


@router.post("/", response_model=OfferResponse)
def send_offer(
    offer: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    product = (
        db.query(Product)
        .filter(Product.id == offer.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send an offer on your own product."
        )

    new_offer = Offer(
        product_id=offer.product_id,
        buyer_id=current_user.id,
        seller_id=product.seller_id,
        offered_price=offer.offered_price,
        status="Pending"
       )

    db.add(new_offer)

    db.add(
         Notification(
         user_id=product.seller_id,
         message=f"📩 New offer received for '{product.title}'."
         )
        )

    db.commit()
    db.refresh(new_offer)

    return new_offer
@router.get("/my", response_model=list[OfferResponse])
def get_my_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offers = (
        db.query(Offer)
        .filter(Offer.buyer_id == current_user.id)
        .all()
    )

    return offers
@router.get("/received", response_model=list[OfferResponse])
def get_received_offers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offers = (
        db.query(Offer)
        .filter(Offer.seller_id == current_user.id)
        .all()
    )

    return offers
@router.put("/{offer_id}/accept", response_model=OfferResponse)
def accept_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to accept this offer."
        )

    offer.status = "Accepted"
    db.add(
    Notification(
        user_id=offer.buyer_id,
        message="✅ Your offer has been accepted."
    )
)

    db.commit()
    db.refresh(offer)

    return offer
@router.put("/{offer_id}/reject", response_model=OfferResponse)
def reject_offer(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to reject this offer."
        )
    offer.status = "Rejected"

    db.add(
       Notification(
        user_id=offer.buyer_id,
        message="❌ Your offer has been rejected."
        )
    )

    db.commit()
    db.refresh(offer)
   

    return offer
@router.put("/{offer_id}/counter", response_model=OfferResponse)
def counter_offer(
    offer_id: int,
    counter: CounterOfferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to counter this offer."
        )

    offer.counter_price = counter.counter_price
    offer.status = "Countered"
    db.add(
    Notification(
        user_id=offer.buyer_id,
        message=f"💰 Seller sent a counter offer of ₹{counter.counter_price}."
    )
)
    db.commit()
    db.refresh(offer)

    return offer
@router.put("/{offer_id}/accept-counter", response_model=OfferResponse)
def accept_counter(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.buyer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only buyer can accept counter offer."
        )

    if offer.status != "Countered":
        raise HTTPException(
            status_code=400,
            detail="Offer is not countered."
        )

    offer.offered_price = offer.counter_price
    offer.status = "Accepted"
    db.add(
    Notification(
        user_id=offer.seller_id,
        message="✅ Buyer accepted your counter offer."
    )
)

    db.commit()
    db.refresh(offer)

    return offer

@router.put("/{offer_id}/reject-counter", response_model=OfferResponse)
def reject_counter(
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.buyer_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only buyer can reject counter offer."
        )

    if offer.status != "Countered":
        raise HTTPException(
            status_code=400,
            detail="Offer is not countered."
        )

    offer.status = "Rejected"
    db.add(
    Notification(
        user_id=offer.seller_id,
        message="❌ Buyer rejected your counter offer."
    )
)
    db.commit()
    db.refresh(offer)

    return offer
@router.put("/{offer_id}/schedule-meeting", response_model=OfferResponse)
def schedule_meeting(
    offer_id: int,
    meeting: MeetingScheduleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    offer = (
        db.query(Offer)
        .filter(Offer.id == offer_id)
        .first()
    )

    if not offer:
        raise HTTPException(
            status_code=404,
            detail="Offer not found"
        )

    if offer.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only seller can schedule meeting."
        )

    if offer.status != "Accepted":
        raise HTTPException(
            status_code=400,
            detail="Meeting can only be scheduled after accepting the offer."
        )

    offer.meeting_date = meeting.meeting_date
    offer.meeting_time = meeting.meeting_time
    offer.meeting_place = meeting.meeting_place
    offer.custom_place = meeting.custom_place
    db.add(
    Notification(
        user_id=offer.buyer_id,
        message="📅 Seller has scheduled a meeting."
    )
)
    db.commit()
    db.refresh(offer)

    return offer