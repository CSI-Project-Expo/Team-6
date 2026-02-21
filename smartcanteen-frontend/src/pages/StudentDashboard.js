import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/admin/hotels")
      .then(res => setHotels(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Available Hotels</h2>

      {hotels.map(hotel => (
        <div key={hotel.hotel_id}>
          <h3>{hotel.hotel_name}</h3>
          <p>{hotel.location}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboard;