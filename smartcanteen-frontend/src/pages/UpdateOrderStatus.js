import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdateOrderStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // 🔐 Protect page
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
        status: status
      });

      alert("Order status updated ✅");
      setOrderId("");
      setStatus("");
      navigate("/hoteladmin/orders");

    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>🔄 Update Order Status</h2>

      <input
        type="number"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <br /><br />

      {/* ✅ Controlled select */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">-- Select Status --</option>
        <option value="PREPARING">PREPARING</option>
        <option value="READY">READY</option>
        <option value="COLLECTED">COLLECTED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <br /><br />

      <button onClick={handleUpdate}>Update Status</button>

      <br /><br />

      <button onClick={() => navigate("/hoteladmin/orders")}>⬅ Back</button>
    </div>
  );
}

export default UpdateOrderStatus;