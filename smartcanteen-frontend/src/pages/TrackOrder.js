import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TrackOrder.css";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = sessionStorage.getItem("user_id");
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    if (!userId || role !== "STUDENT") {
      alert("Please login as student");
      navigate("/login");
    }
  }, [userId, role, navigate]);

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:5000/student/order/${orderId}`
      );

      if (!res.data) {
        setError("Order not found");
      } else {
        setOrder(res.data);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order status");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="track-wrapper">
      <div className="track-hero">
        <h1>Track Your Order</h1>
        <p>Live order status with estimated readiness time</p>
      </div>

      <div className="action-bar">
        <button onClick={() => navigate("/my-orders")}>My Orders</button>
        <button onClick={() => navigate(-1)}>Back</button>
        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="track-content">
        {loading && <p className="info-text">Loading order status...</p>}
        {error && <p className="error-text">{error}</p>}

        {order && !loading && (
          <div className="order-card">
            <h2>Token #{order.order_id}</h2>

            <div className={getStatusClass(order.status)}>
              {order.status}
            </div>

            <div className="smart-insights">
              <div className="insight-card">
                <span>ETA</span>
                <b>{order.eta_minutes ?? 0} min</b>
              </div>
              <div className="insight-card">
                <span>Queue Ahead</span>
                <b>{order.queue_ahead ?? 0}</b>
              </div>
              <div className="insight-card">
                <span>Hotel Load</span>
                <b className={`load-level ${String(order.load_level || "").toLowerCase()}`}>
                  {order.load_level || "LOW"}
                </b>
              </div>
            </div>

            <div className="order-details">
              <p><b>Amount:</b> Rs. {order.total_amount}</p>
              <p><b>Pickup Slot:</b> {order.slot_time}</p>
              <p><b>Date:</b> {order.order_date}</p>
              <p><b>Active Hotel Orders:</b> {order.active_orders_hotel ?? 0}</p>
            </div>

            <button className="refresh-btn" onClick={fetchOrderStatus}>
              Refresh Status
            </button>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2026 SmartCanteen - Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default TrackOrder;
