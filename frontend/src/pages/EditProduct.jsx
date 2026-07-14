import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import {
  FaEdit,
  FaTag,
  FaRupeeSign,
  FaSave,
  FaBoxOpen,
} from "react-icons/fa";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/products/${id}`, product);

      alert("Product Updated Successfully ✅");

      navigate("/my-products");
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-8">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl">
                <FaEdit className="text-3xl" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Edit Product
                </h1>

                <p className="text-orange-100 mt-2">
                  Update your product information.
                </p>
              </div>

            </div>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >

            {/* Title */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Product Title
              </label>

              <div className="relative">

                <FaBoxOpen className="absolute left-4 top-5 text-blue-600" />

                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  placeholder="Product Title"
                  className="w-full border rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />

              </div>

            </div>

            {/* Description */}

            <div>

              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={6}
                placeholder="Product Description"
                className="w-full border rounded-xl px-4 py-4 resize-none focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />

            </div>

            {/* Price & Category */}

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Price
                </label>

                <div className="relative">

                  <FaRupeeSign className="absolute left-4 top-5 text-green-600" />

                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full border rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />

                </div>

              </div>

              <div>

                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>

                <div className="relative">

                  <FaTag className="absolute left-4 top-5 text-blue-600" />

                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    placeholder="Category"
                    className="w-full border rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              <FaSave />
              Update Product
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default EditProduct;