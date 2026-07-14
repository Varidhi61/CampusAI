import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/products/wishlist/my");
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load wishlist.");
    }
  };

  const removeWishlist = async (wishlistId) => {
    try {
      await API.delete(`/products/wishlist/${wishlistId}`);

      alert("Removed from Wishlist ❤️");

      fetchWishlist();
    } catch (err) {
      console.error(err);
      alert("Failed to remove.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8">
          ❤️ My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl text-gray-500">
              Wishlist is Empty
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            {wishlist.map((item) => (

              <div key={item.wishlist_id}>

                <ProductCard
                  product={item.product}
                />

                <button
                  onClick={() =>
                    removeWishlist(item.wishlist_id)
                  }
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
                >
                  Remove from Wishlist
                </button>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyWishlist;