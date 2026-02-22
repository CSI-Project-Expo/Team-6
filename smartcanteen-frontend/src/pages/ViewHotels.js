import { useEffect, useState } from "react";
import axios from "axios";

function ViewHotels() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/superadmin/hotels")
      .then(res => setHotels(res.data));
  }, []);

  return (
    <div>
      <h2>All Hotels</h2>

      <table border="1">
        <tr>
          <th>Hotel</th>
          <th>Location</th>
          <th>Admin</th>
          <th>Status</th>
        </tr>

        {hotels.map(h => (
          <tr key={h.hotel_id}>
            <td>{h.hotel_name}</td>
            <td>{h.location}</td>
            <td>{h.admin_name || "Not Assigned"}</td>
            <td>{h.is_active ? "Active" : "Inactive"}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

export default ViewHotels;