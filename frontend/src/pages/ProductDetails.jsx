import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaRobot,
  FaRupeeSign,
  FaUser,
  FaComments,
  FaTag,
} from "react-icons/fa";
import API from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [offer, setOffer] = useState("");
  const [sendingOffer, setSendingOffer] = useState(false);

  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

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

  const negotiatePrice = async () => {
    if (!offer) {
      alert("Please enter your offer.");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await API.post("/ai/negotiate-price", {
        title: product.title,
        category: product.category,
        original_price: product.price,
        buyer_offer: Number(offer),
      });

      setAiResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Sorry! AI Negotiation is temporarily unavailable.\n\nYou can still enter your offer manually and send it to the seller");
    } finally {
      setLoadingAI(false);
    }
  };

  const sendOffer = async () => {
    if (!offer) {
      alert("Please enter your offer.");
      return;
    }

    try {
      setSendingOffer(true);

      await API.post("/offers/", {
        product_id: product.id,
        offered_price: Number(offer),
      });

      alert("Offer sent successfully ✅");
      setOffer("");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail ||
          "Failed to send offer."
      );
    } finally {
      setSendingOffer(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid lg:grid-cols-2 gap-10">

          {/* Image */}

          <div className="overflow-hidden">
            <img
              src={
                product.image_url
                  ? `http://127.0.0.1:8000${product.image_url}`
                  : "https://placehold.co/800x600?text=No+Image"
              }
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* Details */}

          <div className="p-8">

            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
              <FaTag />
              {product.category}
            </span>

            <h1 className="text-5xl font-bold text-gray-800 mt-6">
              {product.title}
            </h1>

            <p className="mt-6 text-gray-600 leading-8 text-lg">
              {product.description}
            </p>

            <div className="flex items-center gap-2 mt-8">
              <FaRupeeSign className="text-green-600 text-3xl" />
              <span className="text-5xl font-extrabold text-green-600">
                {product.price}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3 text-gray-600">
              <FaUser />
              <span>Verified Campus Seller</span>
            </div>

            {/* AI Negotiation */}

            <div className="mt-10 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">
                <FaRobot className="text-purple-600 text-2xl" />

                <h2 className="text-2xl font-bold text-purple-700">
                  AI Price Negotiation
                </h2>
              </div>

              <input
                type="number"
                placeholder="Enter Your Offer"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full border rounded-xl p-4 mb-5 focus:ring-2 focus:ring-purple-500 outline-none"
              />

              <button
                onClick={negotiatePrice}
                disabled={loadingAI}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-semibold transition"
              >
                {loadingAI
                  ? "Negotiating..."
                  : "🤖 Negotiate with AI"}
              </button>

              <button
                onClick={sendOffer}
                disabled={sendingOffer}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition"
              >
                {sendingOffer
                  ? "Sending Offer..."
                  : "💰 Send Offer to Seller"}
              </button>
                            {aiResult && (
                <div className="mt-6 bg-white rounded-2xl p-5 border border-purple-200">

                  <h3 className="text-xl font-bold text-purple-700">
                    AI Suggestion
                  </h3>

                  <div className="mt-5">

                    <p className="text-lg">
                      <strong>Counter Offer :</strong>

                      <span className="text-green-600 font-bold text-xl">
                        {" "}
                        ₹ {aiResult.counter_offer}
                      </span>
                    </p>

                    <p className="mt-4 leading-7 text-gray-700">
                      <strong>Reason</strong>

                      <br />

                      {aiResult.reason}
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-4 mt-10">

              

              <Link to="/">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition">
                  <FaArrowLeft />
                  Back
                </button>
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;