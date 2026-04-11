import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const userId = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/student/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, [userId]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status placed";
      case "PREPARING":
        return "status preparing";
      case "READY":
        return "status ready";
      case "COLLECTED":
        return "status collected";
      case "CANCELLED":
        return "status cancelled";
      default:
        return "status";
    }
  };

  return (
    <div className="orders-wrapper">

      {/* HEADER */}
      <div className="orders-header">
        <h1>📜 My Orders</h1>
        <p>Your complete SmartCanteen order history</p>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>

      {/* CONTENT */}
      <div className="orders-content">

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>😔 No Orders Yet</h2>
            <p>Start ordering delicious food from SmartCanteen</p>
            <button onClick={() => navigate("/student/menu")}>
              🍽 Order Now
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div className="order-card" key={order.order_id}>

                <div className="order-top">
                  <h3>🎫 Order #{order.order_id}</h3>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  <p><b>📅 Date:</b> {order.order_date}</p>
                  <p><b>💰 Total:</b> ₹{order.total_amount}</p>
                  <p><b>🎟 Token:</b> {order.token_code || "Not generated yet"}</p>
                </div>

                <div className="order-actions">
                  <button onClick={() => navigate(`/order-status/${order.order_id}`)}>
                    📦 Track Order
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>

    </div>
  );
}

export default MyOrders;
