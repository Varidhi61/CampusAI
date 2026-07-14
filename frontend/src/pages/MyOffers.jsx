import { useEffect, useState } from "react";
import API from "../services/api";

function MyOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await API.get("/offers/my");
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load offers.");
    }
  };

  const acceptCounter = async (id) => {
  try {

    await API.put(`/offers/${id}/accept-counter`);

    alert("Counter Offer Accepted ✅");

    fetchOffers();

  } catch (err) {

    console.error(err);

    alert("Failed to accept counter offer.");

  }
};

const rejectCounter = async (id) => {
  try {

    await API.put(`/offers/${id}/reject-counter`);

    alert("Counter Offer Rejected ❌");

    fetchOffers();

  } catch (err) {

    console.error(err);

    alert("Failed to reject counter offer.");

  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8">
          My Offers
        </h1>

        {offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl text-gray-500">
              No Offers Found
            </h2>
          </div>
        ) : (
          <div className="space-y-5">

            {offers.map((offer) => (

              <div
                key={offer.id}
                className="bg-white rounded-xl shadow p-6"
              >

                <div className="flex justify-between">

                  <div>
                    <h2 className="text-xl font-bold">
                      Product ID : {offer.product_id}
                    </h2>

                    <p className="mt-2">
                      Offered Price :
                      <span className="font-semibold text-green-600">
                        {" "}
                        ₹ {offer.offered_price}
                      </span>
                    </p>

                    {offer.counter_price && (
                      <p className="mt-2">
                        Counter Price :
                        <span className="font-semibold text-blue-600">
                          {" "}
                          ₹ {offer.counter_price}
                        </span>
                      </p>
                    )}
                    {offer.status === "Countered" && (
                     <div className="mt-4 flex gap-3">

                    <button
                     onClick={() => acceptCounter(offer.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                     >
                     ✅ Accept Counter
                    </button>

                    <button
                    onClick={() => rejectCounter(offer.id)}
                     className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                     >
                    ❌ Reject Counter
                     </button>

                    </div>
                    )}

                    {offer.meeting_date && (
  <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">

    <h3 className="font-bold text-green-700 mb-3">
      📅 Meeting Details
    </h3>

    <p className="mb-2">
      <span className="font-semibold">
        Date :
      </span>{" "}
      {offer.meeting_date}
    </p>

    <p className="mb-2">
      <span className="font-semibold">
        Time :
      </span>{" "}
      {offer.meeting_time}
    </p>

    <p className="mb-2">
      <span className="font-semibold">
        Place :
      </span>{" "}
      {offer.meeting_place}
    </p>

    {offer.custom_place && (
      <p>
        <span className="font-semibold">
          Custom Place :
        </span>{" "}
        {offer.custom_place}
      </p>
    )}

  </div>
)}
                  </div>

                  <div>

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                      {offer.status}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyOffers;