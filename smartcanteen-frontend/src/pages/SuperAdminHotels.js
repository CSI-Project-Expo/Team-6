import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LegacyPages.css";

function SuperAdminHotels() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/superadmin/hotels");
      setHotels(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load hotels");
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card">
        <h2 className="lp-title">Hotels List</h2>
        <div className="lp-actions">
          <button className="lp-btn secondary" onClick={() => navigate("/superadmin/dashboard")}>
            Back
          </button>
          <button className="lp-btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="lp-table-wrap">
          <table className="lp-table">
            <thead>
              <tr>
                <th>Hotel ID</th>
                <th>Hotel Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Hotel Admin</th>
              </tr>
            </thead>

            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.hotel_id}>
                  <td>{hotel.hotel_id}</td>
                  <td>{hotel.hotel_name}</td>
                  <td>{hotel.location}</td>
                  <td>{hotel.is_active ? "Active" : "Inactive"}</td>
                  <td>{hotel.admin_name || "Not Assigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminHotels;
