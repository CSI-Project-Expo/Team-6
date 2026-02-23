import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AssignHotelAdmin() {
  const [admins, setAdmins] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchAdmins();
    fetchHotels();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/superadmin/hotel-admins",
        {
          headers: {
            role: role
          }
        }
      );
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/superadmin/hotels",
        {
          headers: {
            role: role
          }
        }
      );
      setHotels(res.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAdmin || !selectedHotel) {
      alert("Select admin and hotel");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/assign-hotel-admin",
        {
          user_id: selectedAdmin,
          hotel_id: selectedHotel
        },
        {
          headers: {
            role: role
          }
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

      <select onChange={(e) => setSelectedAdmin(e.target.value)}>
        <option value="">Select Admin</option>
        {admins.map((admin) => (
          <option key={admin.id} value={admin.id}>
            {admin.name}
          </option>
        ))}
      </select>

      <br /><br />

      <select onChange={(e) => setSelectedHotel(e.target.value)}>
        <option value="">Select Hotel</option>
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.hotel_name}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleAssign}>Assign</button>

      <p>{message}</p>

      <button onClick={() => navigate("/superadmin/dashboard")}>
        ⬅ Back
      </button>
    </div>
  );
}

export default AssignHotelAdmin;