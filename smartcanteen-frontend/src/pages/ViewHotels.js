import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewHotels() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/superadmin/hotels")
      .then(res => setHotels(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>🏨 All Hotels</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Hotel ID</th>
            <th>Hotel Name</th>
            <th>Location</th>
            <th>Status</th>
            <th>Assigned Admin</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
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

      <br />
      <button onClick={() => navigate("/superadmin")}>⬅ Back</button>
    </div>
  );
}

export default ViewHotels;