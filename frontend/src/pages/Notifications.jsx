import { useEffect, useState } from "react";
import API from "../services/api";

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {

      const res = await API.get("/notifications");

      setNotifications(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to load notifications.");

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8">
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl text-gray-500">
              No Notifications
            </h2>
          </div>

        ) : (

          <div className="space-y-4">

            {notifications.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5"
              >
                {item.message}
              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Notifications;