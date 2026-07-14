import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaTag,
  FaRupeeSign,
  FaHeart,
} from "react-icons/fa";

function ProductCard({
  
  product,
  onDelete,
  showActions = false,
}) {
  const [loadingWishlist, setLoadingWishlist] = useState(false);

const addToWishlist = async () => {
  try {
    setLoadingWishlist(true);

    await API.post("/products/wishlist", {
      product_id: product.id,
    });

    alert("Added to Wishlist ❤️");
  } catch (err) {
    console.error(err);

    if (err.response?.status === 400) {
      alert("Already in Wishlist");
    } else {
      alert("Failed to add to Wishlist");
    }
  } finally {
    setLoadingWishlist(false);
  }
};
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      {/* Product Image */}

      <div className="relative overflow-hidden">
        <img
          src={
            product.image_url
              ? `http://127.0.0.1:8000${product.image_url}`
              : "https://placehold.co/600x400?text=No+Image"
          }
          alt={product.title}
          className="w-full h-60 object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4">
          <span className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold text-blue-700 shadow">
            <FaTag />
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 line-clamp-1">
          {product.title}
        </h2>

        <p className="text-gray-600 mt-3 line-clamp-3 min-h-[72px]">
          {product.description}
        </p>

        {/* Price */}

        <div className="flex items-center gap-2 mt-6">
          <FaRupeeSign className="text-green-600" />

          <span className="text-3xl font-extrabold text-green-600">
            {product.price}
          </span>
        </div>

        {/* Buttons */}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
           onClick={addToWishlist}
           disabled={loadingWishlist}
           className="bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-3 rounded-xl transition"
          >
           <FaHeart />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1"
          >
            <button className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-semibold">
              <FaEye />
              View
            </button>
          </Link>

          {showActions && (
            <>
              <Link
                to={`/edit-product/${product.id}`}
                className="flex-1"
              >
                <button className="w-full flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl transition font-semibold">
                  <FaEdit />
                  Edit
                </button>
              </Link>

              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition font-semibold"
              >
                <FaTrash />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;