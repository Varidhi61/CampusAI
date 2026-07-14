import { useEffect, useState } from "react";
import { FaBoxOpen, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/my/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== id)
      );

      alert("Product Deleted Successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Delete Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl shadow-xl p-8 text-white flex flex-col lg:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-5">

            <div className="bg-white/20 p-5 rounded-2xl">
              <FaBoxOpen className="text-4xl" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                My Products
              </h1>

              <p className="text-blue-100 mt-2">
                Manage, edit and delete your product listings.
              </p>
            </div>

          </div>

          <Link to="/add-product">
            <button className="flex items-center gap-3 bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow-lg transition">
              <FaPlusCircle />
              Add New Product
            </button>
          </Link>

        </div>

        {/* Product Count */}

        <div className="mt-10 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Total Products: {products.length}
          </h2>
        </div>

        {/* Empty State */}

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

            <FaBoxOpen className="mx-auto text-6xl text-blue-500 mb-6" />

            <h2 className="text-3xl font-bold text-gray-700">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-4">
              You haven't added any products yet.
            </p>

            <Link to="/add-product">
              <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                Add Your First Product
              </button>
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={deleteProduct}
                showActions={true}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyProducts;