import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const res = await api.get("/admin/hotels");
    setHotels(res.data);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      <h3>Select Hotel</h3>
      {hotels.map((hotel) => (
        <div key={hotel.hotel_id}>
          <p>{hotel.hotel_name}</p>
          <button onClick={() => navigate(`/menu?hotel_id=${hotel.hotel_id}`)}>
            View Menu
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;