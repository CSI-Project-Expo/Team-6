import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LegacyPages.css";

function UpdateOrderStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [role, navigate]);

  const handleUpdate = async () => {
    if (!orderId || !status) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.put("http://127.0.0.1:5000/hoteladmin/update-order", {
        order_id: Number(orderId),
        status: status,
      });

      alert("Order status updated");
      setOrderId("");
      setStatus("");
      navigate("/hoteladmin/orders");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card narrow">
        <h2 className="lp-title">Update Order Status</h2>
        <p className="lp-subtitle">Change order state for active kitchen workflow.</p>

        <div className="lp-form">
          <input
            type="number"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- Select Status --</option>
            <option value="PREPARING">PREPARING</option>
            <option value="READY">READY</option>
            <option value="COLLECTED">COLLECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <div className="lp-actions">
            <button className="lp-btn" onClick={handleUpdate}>
              Update Status
            </button>
            <button className="lp-btn secondary" onClick={() => navigate("/hoteladmin/orders")}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateOrderStatus;
