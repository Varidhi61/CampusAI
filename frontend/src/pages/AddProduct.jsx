import { useState, useRef } from "react";
import API from "../services/api";
import {
  FaMagic,
  FaCloudUploadAlt,
  FaTag,
  FaRupeeSign,
  FaImage,
  FaBoxOpen,
} from "react-icons/fa";

function AddProduct() {
  const fileRef = useRef();

  const [loadingAI, setLoadingAI] = useState(false);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const generateDescription = async () => {
    if (!product.title.trim()) {
      alert("Please enter product title first.");
      return;
    }

    try {
      setLoadingAI(true);

      const response = await API.get(
        `/ai/generate-description?title=${encodeURIComponent(
          product.title
        )}`
      );

      setProduct((prev) => ({
        ...prev,
        description: response.data.description,
      }));
    } catch (error) {
      console.error(error);
      alert("Sorry! AI service is temporarily unavailable.\n\nPlease enter the product description manually.");
    } finally {
      setLoadingAI(false);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();

    formData.append("file", fileRef.current.files[0]);

    const response = await API.post(
      "/products/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.image_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrl = await uploadImage();

      await API.post("/products/", {
        ...product,
        image_url: imageUrl,
      });

      alert("Product Added Successfully ✅");

      setProduct({
        title: "",
        description: "",
        price: "",
        category: "",
      });

      fileRef.current.value = "";
    } catch (error) {
      console.error(error);
      alert("Failed to Add Product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl">
                <FaBoxOpen className="text-3xl" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Add New Product
                </h1>

                <p className="text-blue-100 mt-2">
                  Sell your product with AI-powered assistance.
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
              <label className="font-semibold text-gray-700 mb-2 block">
                Product Title
              </label>

              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Enter Product Title"
                className="w-full border rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* AI */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={generateDescription}
                disabled={loadingAI}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition font-semibold"
              >
                <FaMagic />

                {loadingAI
                  ? "Generating..."
                  : "Generate AI Description"}
              </button>

            </div>

            {/* Description */}

            <div>
              <label className="font-semibold text-gray-700 mb-2 block">
                Description
              </label>

              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={6}
                placeholder="Product Description"
                className="w-full border rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>

            {/* Price & Category */}

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
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
                    className="w-full border rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />

                </div>

              </div>

              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
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
                    className="w-full border rounded-xl pl-10 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />

                </div>

              </div>

            </div>

            {/* Image */}

            <div>

              <label className="font-semibold text-gray-700 mb-2 block">
                Product Image
              </label>

              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50">

                <div className="flex items-center gap-3 mb-4">

                  <FaImage className="text-blue-600 text-2xl" />

                  <span className="font-medium">
                    Upload Product Image
                  </span>

                </div>

                <input
                  type="file"
                  ref={fileRef}
                  accept="image/*"
                  className="w-full"
                  required
                />

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              <FaCloudUploadAlt />
              Add Product
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default AddProduct;