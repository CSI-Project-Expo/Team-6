import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStatus();
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/student/order/${orderId}`
      );
      setOrder(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch order status");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Track Your Order</h2>

      {loading ? (
        <p>Loading order status...</p>
      ) : (
        <>
          <p><b>Order ID:</b> {order.order_id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Total Amount:</b> ₹{order.total_amount}</p>

          <button onClick={fetchOrderStatus}>🔄 Refresh Status</button>
        </>
      )}
    </div>
  );
}

export default TrackOrder;