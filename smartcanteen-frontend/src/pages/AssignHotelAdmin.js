import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssignHotelAdmin.css";

function AssignHotelAdmin() {
  const [admins, setAdmins] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [userId, setUserId] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [message, setMessage] = useState("");

  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchAdmins();
    fetchHotels();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/superadmin/hotel-admins",
        { headers: { role } }
      );
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/superadmin/hotels",
        { headers: { role } }
      );
      setHotels(res.data);
    } catch (err) {
      console.error(err);
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
        { user_id: userId, hotel_id: hotelId },
        { headers: { role } }
      );
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Assignment failed");
    }
  };

  return (
    <div className="aha-page">
      <header className="aha-header">
        <h1>Super Admin</h1>
        <div className="aha-header-actions">
          <button
            className="aha-back-btn"
            onClick={() => navigate("/superadmin/dashboard")}
          >
            Back
          </button>
          <button className="aha-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="aha-hero">
        <h2>Assign Hotel Admin</h2>
        <p>Link hotel admins to hotels</p>
      </section>

      <div className="aha-card">
        <select
          className="aha-select"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select Admin</option>
          {admins.map((admin) => (
            <option key={admin.user_id} value={admin.user_id}>
              {admin.name}
            </option>
          ))}
        </select>

        <select
          className="aha-select"
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
        >
          <option value="">Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.hotel_id} value={hotel.hotel_id}>
              {hotel.hotel_name}
            </option>
          ))}
        </select>

        <button className="aha-primary-btn" onClick={handleAssign}>
          Assign
        </button>

        {message && <p className="aha-msg">{message}</p>}
      </div>

      <footer className="aha-footer">2026 Smart Canteen System</footer>
    </div>
  );
}

export default AssignHotelAdmin;
