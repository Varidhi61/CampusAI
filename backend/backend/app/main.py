from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os  # <-- os module ko import kiya

from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.offers import router as offers_router
from app.database.db import Base, engine
from fastapi.staticfiles import StaticFiles
from app.models.user import User
from app.models.product import Product
from app.models.offer import Offer
from app.models.wishlist import Wishlist
from app.models.notification import Notification
from app.routers.ai import router as ai_router
from app.routers.notification import router as notifications_router
print("========== LOADED app.main ==========")
# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusAI API",
    version="1.0.0",
    description="AI Powered Student Marketplace"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Render server par error se bachne ke liye 'uploads' folder ko auto-create karna:
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(offers_router)
app.include_router(products_router)
app.include_router(ai_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {
        "message": "CampusAI Backend Running Successfully 🚀"
    }
@app.get("/test")
def test():
    return {
        "status": "working"
    }    
    
@app.get("/hello")
def hello():
    return {"message": "Hello Render"}    