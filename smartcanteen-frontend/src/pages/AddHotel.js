import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddHotel() {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleAddHotel = async () => {
    if (!hotelName || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/add-hotel",
        {
          hotel_name: hotelName,
          location: location
        }
      );

      setMessage(res.data.message);
      setHotelName("");
      setLocation("");

    } catch (error) {
      console.log(error);
      setMessage("Failed to add hotel");
    }
  };

  return (
    <div>
      <h2>➕ Add Hotel</h2>

      <input
        type="text"
        placeholder="Hotel Name"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAddHotel}>Add Hotel</button>
      <br /><br />

      <p>{message}</p>

      <button onClick={() => navigate("/superadmin")}>⬅ Back</button>
    </div>
  );
}

export default AddHotel;