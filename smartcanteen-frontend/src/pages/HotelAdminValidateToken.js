import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HotelAdminValidateToken.css";

function HotelAdminValidateToken() {
  const [token, setToken] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

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

      setOrder(res.data.order);
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
    } catch {
      alert("Failed to update order status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="validate-page">

      {/* HEADER */}
      <div className="validate-header">
        <h2>🎟 Token Validation</h2>
        <p>Verify student tokens and complete orders</p>
      </div>

      {/* ACTIONS */}
      <div className="validate-actions">
        <button onClick={() => navigate("/hoteladmin/orders")}>📦 Orders</button>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* CARD */}
      <div className="validate-card">
        <input
          type="text"
          placeholder="Enter Token Number"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button onClick={handleValidate}>Validate Token</button>

        {message && <p className="validate-message">{message}</p>}
      </div>

      {/* ORDER DETAILS */}
      {order && (
        <div className="order-card">
          <h3>📋 Order Details</h3>
          <p><b>Order ID:</b> {order.order_id}</p>
          <p><b>User ID:</b> {order.user_id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Amount:</b> ₹{order.total_amount}</p>

          {order.status !== "COLLECTED" && (
            <button className="collect-btn" onClick={handleCollect}>
              ✅ Mark as Collected
            </button>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="validate-footer">
        <p>© 2026 🍽 SmartCanteen | Token Validation Module</p>
      </footer>

    </div>
  );
}

export default HotelAdminValidateToken;