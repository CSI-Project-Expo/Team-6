import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignHotelAdmin() {
  const [admins, setAdmins] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [userId, setUserId] = useState("");
  const [hotelId, setHotelId] = useState("");

  const [message, setMessage] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchAdmins();
    fetchHotels();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/superadmin/hotel-admins", {
        headers: { role: role }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/superadmin/hotels", {
        headers: { role: role }
      });
      setHotels(res.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  const handleAssign = async () => {
    if (!userId || !hotelId) {
      alert("Please select both admin and hotel");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/assign-hotel-admin",
        {
          user_id: userId,
          hotel_id: hotelId
        },
        {
          headers: { role: role }
        }
      );

      setMessage(res.data.message);
    } catch (error) {
      console.error("Error assigning:", error);
      setMessage("Assignment failed");
    }
  };

  return (
    <div>
      <h2>Assign Hotel Admin</h2>

      <select onChange={(e) => setUserId(e.target.value)}>
        <option value="">Select Admin</option>
        {admins.map((admin) => (
          <option key={admin.user_id} value={admin.user_id}>
            {admin.name}
          </option>
        ))}
      </select>

      <br /><br />

      <select onChange={(e) => setHotelId(e.target.value)}>
        <option value="">Select Hotel</option>
        {hotels.map((hotel) => (
          <option key={hotel.hotel_id} value={hotel.hotel_id}>
            {hotel.hotel_name}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleAssign}>Assign</button>

      <p>{message}</p>
    </div>
  );
}

export default AssignHotelAdmin;