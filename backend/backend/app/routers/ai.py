import os
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from google import genai

from app.schemas.product import (
    NegotiationRequest,
    NegotiationResponse,
)

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

# ==========================
# AI Description Generator
# ==========================

@router.get("/generate-description")
def generate_description(title: str):

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=f"""
Write a professional marketplace product description.

Product:
{title}

Rules:
- Under 80 words
- Attractive
- Easy to read
- Mention important features
"""
        )

        return {
            "description": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# ==========================
# AI Price Negotiation
# ==========================

@router.post(
    "/negotiate-price",
    response_model=NegotiationResponse
)
def negotiate_price(data: NegotiationRequest):

    prompt = f"""
You are an AI marketplace negotiation assistant.

Product:
{data.title}

Category:
{data.category}

Original Price:
₹{data.original_price}

Buyer Offer:
₹{data.buyer_offer}

Suggest a fair counter offer.

Reply ONLY in JSON.

Example:

{{
"counter_offer":2800,
"reason":"The buyer offer is reasonable but slightly low."
}}
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    result = json.loads(text)

    return result