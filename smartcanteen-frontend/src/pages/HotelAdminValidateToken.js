import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HotelAdminValidateToken() {
  const [token, setToken] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // 🔐 Protect route
  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [role, navigate]);

  const handleValidate = async () => {
    if (!token) {
      alert("Enter token number");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/token/validate", {
        token_code: token
      });

      setOrder(res.data.order); // backend should return order details
      setMessage(res.data.message);

    } catch (error) {
      setOrder(null);
      setMessage(error.response?.data?.message || "Validation failed");
    }
  };

  const handleCollect = async () => {
    try {
      await axios.put("http://127.0.0.1:5000/hoteladmin/update-order", {
        order_id: order.order_id,
        status: "COLLECTED"
      });

      alert("Order marked as COLLECTED ✅");
      setOrder(null);
      setToken("");
      setMessage("");

    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎟 Validate Token (Hotel Admin)</h2>

      <button onClick={() => navigate("/hoteladmin/orders")}>📦 Orders</button>
      <button onClick={handleLogout}>🚪 Logout</button>
<button onClick={() => navigate(-1)}>⬅ Back</button>
      <br /><br />

      <input
        type="text"
        placeholder="Enter Token Number"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={handleValidate}>Validate Token</button>

      <br /><br />

      {message && <h3>{message}</h3>}

      {order && (
        <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>
          <h3>Order Details</h3>
          <p><b>Order ID:</b> {order.order_id}</p>
          <p><b>User ID:</b> {order.user_id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Amount:</b> ₹{order.total_amount}</p>

          {order.status !== "COLLECTED" && (
            <button onClick={handleCollect}>✅ Mark as Collected</button>
          )}
        </div>
      )}
    </div>
  );
}

export default HotelAdminValidateToken;