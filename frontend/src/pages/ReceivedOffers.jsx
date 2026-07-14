import { useEffect, useState } from "react";
import API from "../services/api";

function ReceivedOffers() {
  const [offers, setOffers] = useState([]);
  const [counterPrices, setCounterPrices] = useState({});

  const [meetingData, setMeetingData] = useState({});
  const [showMeetingForm, setShowMeetingForm] = useState({});
  const [loadingMeeting, setLoadingMeeting] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await API.get("/offers/received");
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load received offers.");
    }
  };

  const acceptOffer = async (id) => {
    try {
      await API.put(`/offers/${id}/accept`);
      alert("Offer Accepted ✅");
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to accept offer.");
    }
  };

  const rejectOffer = async (id) => {
    try {
      await API.put(`/offers/${id}/reject`);
      alert("Offer Rejected ❌");
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to reject offer.");
    }
  };

  const sendCounter = async (id) => {
    const price = counterPrices[id];
    if (!price) {
      alert("Enter Counter Price");
      return;
    }

    try {
      await API.put(`/offers/${id}/counter`, {
        counter_price: Number(price),
      });
      alert("Counter Offer Sent ✅");
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to send counter offer.");
    }
  };

  const scheduleMeeting = async (id) => {
    const meeting = meetingData[id];
    if (
      !meeting ||
      !meeting.meeting_date ||
      !meeting.meeting_time ||
      !meeting.meeting_place
    ) {
      alert("Please fill all meeting details.");
      return;
    }

    try {
      setLoadingMeeting(true);

      await API.put(`/offers/${id}/schedule-meeting`, {
        meeting_date: meeting.meeting_date,
        meeting_time: meeting.meeting_time,
        meeting_place: meeting.meeting_place,
        custom_place: meeting.custom_place || "",
      });

      alert("Meeting Scheduled Successfully ✅");
      setShowMeetingForm({
        ...showMeetingForm,
        [id]: false,
      });
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to schedule meeting.");
    } finally {
      setLoadingMeeting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Received Offers</h1>

        {offers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl text-gray-500">No Offers Received</h2>
          </div>
        ) : (
          <div className="space-y-5">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      Product ID : {offer.product_id}
                    </h2>

                    <p className="mt-3">
                      Buyer Offer :
                      <span className="text-green-600 font-semibold">
                        {" "}
                        ₹ {offer.offered_price}
                      </span>
                    </p>

                    {offer.counter_price && (
                      <p className="mt-2">
                        Counter Price :
                        <span className="text-blue-600 font-semibold">
                          {" "}
                          ₹ {offer.counter_price}
                        </span>
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => acceptOffer(offer.id)}
                        disabled={offer.status !== "Pending"}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => rejectOffer(offer.id)}
                        disabled={offer.status !== "Pending"}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
                      >
                        Reject
                      </button>

                      <input
                        type="number"
                        placeholder="Counter Price"
                        value={counterPrices[offer.id] || ""}
                        onChange={(e) =>
                          setCounterPrices({
                            ...counterPrices,
                            [offer.id]: e.target.value,
                          })
                        }
                        className="border rounded-lg px-3 py-2 w-44"
                        disabled={offer.status !== "Pending"}
                      />

                      <button
                        onClick={() => sendCounter(offer.id)}
                        disabled={offer.status !== "Pending"}
                        className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
                      >
                        Send Counter
                      </button>
                    </div>

                    {/* ERROR YAHAN THA: Dono components ko <> aur </> ke andar wrap kiya hai */}
                    {offer.status === "Accepted" && (
                      <>
                        <div className="mt-5">
                          <button
                            onClick={() =>
                              setShowMeetingForm({
                                ...showMeetingForm,
                                [offer.id]: !showMeetingForm[offer.id],
                              })
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
                          >
                            📅 Schedule Meeting
                          </button>
                        </div>

                        {showMeetingForm[offer.id] && (
                          <div className="mt-5 border rounded-xl p-5 bg-gray-50">
                            <h3 className="text-lg font-bold mb-4">
                              Schedule Meeting
                            </h3>

                            <input
                              type="date"
                              className="border rounded-lg p-2 w-full mb-3"
                              onChange={(e) =>
                                setMeetingData({
                                  ...meetingData,
                                  [offer.id]: {
                                    ...meetingData[offer.id],
                                    meeting_date: e.target.value,
                                  },
                                })
                              }
                            />

                            <input
                              type="time"
                              className="border rounded-lg p-2 w-full mb-3"
                              onChange={(e) =>
                                setMeetingData({
                                  ...meetingData,
                                  [offer.id]: {
                                    ...meetingData[offer.id],
                                    meeting_time: e.target.value,
                                  },
                                })
                              }
                            />

                            <select
                              className="border rounded-lg p-2 w-full mb-3"
                              onChange={(e) =>
                                setMeetingData({
                                  ...meetingData,
                                  [offer.id]: {
                                    ...meetingData[offer.id],
                                    meeting_place: e.target.value,
                                  },
                                })
                              }
                            >
                              <option value="">Select Meeting Place</option>
                              <option value="Library">Library</option>
                              <option value="Canteen">Canteen</option>
                              <option value="Main Gate">Main Gate</option>
                              <option value="Hostel">Hostel</option>
                              <option value="Other">Other</option>
                            </select>

                            {meetingData[offer.id]?.meeting_place === "Other" && (
                              <input
                                type="text"
                                placeholder="Enter Custom Place"
                                className="border rounded-lg p-2 w-full mb-3"
                                onChange={(e) =>
                                  setMeetingData({
                                    ...meetingData,
                                    [offer.id]: {
                                      ...meetingData[offer.id],
                                      custom_place: e.target.value,
                                    },
                                  })
                                }
                              />
                            )}

                            <button
                              onClick={() => scheduleMeeting(offer.id)}
                              disabled={loadingMeeting}
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                            >
                              {loadingMeeting ? "Scheduling..." : "Confirm Meeting"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full font-medium ${
                      offer.status === "Accepted"
                        ? "bg-green-100 text-green-700"
                        : offer.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : offer.status === "Countered"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceivedOffers;