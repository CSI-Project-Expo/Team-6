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

  // Fetch hotel admins
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/superadmin/hotel-admins")
      .then(res => setAdmins(res.data))
      .catch(err => console.log(err));
  }, []);

  // Fetch hotels
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/superadmin/hotels")
      .then(res => setHotels(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAssign = async () => {
    if (!selectedAdmin || !selectedHotel) {
      alert("Please select both admin and hotel");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/assign-hotel-admin",
        {
          user_id: selectedAdmin,
          hotel_id: selectedHotel
        }
      );

      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      setMessage("Assignment failed");
    }
  };

  return (
    <div>
      <h2>🔗 Assign Hotel Admin</h2>

      <h4>Select Hotel Admin</h4>
      <select onChange={(e) => setSelectedAdmin(e.target.value)}>
        <option value="">Select Admin</option>
        {admins.map(admin => (
          <option key={admin.user_id} value={admin.user_id}>
            {admin.name} ({admin.email})
          </option>
        ))}
      </select>

      <h4>Select Hotel</h4>
      <select onChange={(e) => setSelectedHotel(e.target.value)}>
        <option value="">Select Hotel</option>
        {hotels.map(hotel => (
          <option key={hotel.hotel_id} value={hotel.hotel_id}>
            {hotel.hotel_name}
          </option>
        ))}
      </select>

      <br /><br />
      <button onClick={handleAssign}>Assign</button>

      <p>{message}</p>

      <button onClick={() => navigate("/superadmin")}>⬅ Back</button>
    </div>
  );
}

export default AssignHotelAdmin;