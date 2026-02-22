import { useState } from "react";
import axios from "axios";

function AddHotel() {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const handleAddHotel = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/superadmin/add-hotel", {
        hotel_name: hotelName,
        location: location
      });

      setMessage("Hotel added successfully ✅");
      setHotelName("");
      setLocation("");
    } catch (error) {
      setMessage("Failed to add hotel ❌");
    }
  };

  return (
    <div>
      <h2>Add Hotel</h2>

      <input
        placeholder="Hotel Name"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
      /><br/>

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      /><br/>

      <button onClick={handleAddHotel}>Add Hotel</button>

      <p>{message}</p>
    </div>
  );
}

export default AddHotel;