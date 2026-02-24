import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  // 🔐 Protect page
  useEffect(() => {
    if (!userId || role !== "STUDENT") {
      alert("Please login as student");
      navigate("/login");
    }
  }, [userId, role, navigate]);

  useEffect(() => {
    fetchOrderStatus();

    // 🔄 Auto refresh every 10 seconds
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
    } catch (error) {
      console.error(error);
      setError("Failed to fetch order status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "blue";
      case "PREPARING":
        return "orange";
      case "READY":
        return "green";
      case "COLLECTED":
        return "gray";
      case "CANCELLED":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Track Your Order</h2>

      <button onClick={() => navigate("/my-orders")}>📜 My Orders</button>
      <button onClick={() => navigate(-1)}>⬅ Back</button>
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        🚪 Logout
      </button>
<button onClick={() => navigate(-1)}>⬅ Back</button>
      <hr />

      {loading && <p>Loading order status...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {order && !loading && (
        <>
          <p><b>Order ID:</b> {order.order_id}</p>
          <p>
            <b>Status:</b>{" "}
            <span style={{ color: getStatusColor(order.status) }}>
              {order.status}
            </span>
          </p>
          <p><b>Total Amount:</b> ₹{order.total_amount}</p>
          <p><b>Pickup Slot:</b> {order.slot_time}</p>
          <p><b>Order Date:</b> {order.order_date}</p>

          <button onClick={fetchOrderStatus}>🔄 Refresh Status</button>
        </>
      )}
    </div>
  );
}

export default TrackOrder;