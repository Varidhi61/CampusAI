from fastapi import UploadFile, File
import os
import shutil
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import get_current_user
from app.database.db import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.models.wishlist import Wishlist
from app.schemas.wishlist import WishlistCreate, WishlistResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post("/", response_model=ProductResponse)
def add_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_product = Product(
        title=product.title,
        description=product.description,
        price=product.price,
        category=product.category,
        image_url=product.image_url,
        seller_id=current_user.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

@router.get("/my/products", response_model=list[ProductResponse])
def get_my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    products = (
        db.query(Product)
        .filter(Product.seller_id == current_user.id)
        .all()
    )

    return products    

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update this product"
        )

    product.title = updated_product.title
    product.description = updated_product.description
    product.price = updated_product.price
    product.category = updated_product.category

    db.commit()
    db.refresh(product)

    return product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.seller_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete this product"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }
@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):

    upload_folder = "uploads"

    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Image uploaded successfully",
        "image_url": f"/uploads/{file.filename}"
    }

@router.post("/wishlist", response_model=WishlistResponse)
def add_to_wishlist(
    wishlist: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    product = (
        db.query(Product)
        .filter(Product.id == wishlist.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing = (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == current_user.id,
            Wishlist.product_id == wishlist.product_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Product already in wishlist"
        )

    new_item = Wishlist(
        user_id=current_user.id,
        product_id=wishlist.product_id
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item       
    
@router.get("/wishlist/my")
def get_my_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    wishlist = (
        db.query(Wishlist, Product)
        .join(Product, Wishlist.product_id == Product.id)
        .filter(Wishlist.user_id == current_user.id)
        .all()
    )

    return [
        {
            "wishlist_id": item.id,
            "product": product
        }
        for item, product in wishlist
    ]
    
@router.delete("/wishlist/{wishlist_id}")
def remove_from_wishlist(
    wishlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.id == wishlist_id,
            Wishlist.user_id == current_user.id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed from wishlist"
    }    