import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Hotels List</h2>

      <button onClick={() => navigate("/superadmin/dashboard")}>Back</button>
      <button onClick={handleLogout}>Logout</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
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
  );
}

export default SuperAdminHotels;
