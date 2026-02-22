import { useEffect, useState } from "react";
import axios from "axios";

function AssignHotelAdmin() {
  const [admins, setAdmins] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/superadmin/hotel-admins")
      .then(res => setAdmins(res.data));

    axios.get("http://127.0.0.1:5000/superadmin/hotels")
      .then(res => setHotels(res.data));
  }, []);

  const handleAssign = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/superadmin/assign-hotel-admin", {
        user_id: selectedAdmin,
        hotel_id: selectedHotel
      });

      setMessage("Assigned successfully ✅");
    } catch (error) {
      setMessage("Assignment failed ❌");
    }
  };

  return (
    <div>
      <h2>Assign Hotel Admin</h2>

      <select onChange={(e)=>setSelectedAdmin(e.target.value)}>
        <option value="">Select Admin</option>
        {admins.map(a => (
          <option key={a.user_id} value={a.user_id}>
            {a.name}
          </option>
        ))}
      </select><br/><br/>

      <select onChange={(e)=>setSelectedHotel(e.target.value)}>
        <option value="">Select Hotel</option>
        {hotels.map(h => (
          <option key={h.hotel_id} value={h.hotel_id}>
            {h.hotel_name}
          </option>
        ))}
      </select><br/><br/>

      <button onClick={handleAssign}>Assign</button>

      <p>{message}</p>
    </div>
  );
}

export default AssignHotelAdmin;