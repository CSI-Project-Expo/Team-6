import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UpdateOrderStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!orderId || !status) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.put("http://127.0.0.1:5000/hoteladmin/update-order", {
        order_id: orderId,
        status: status
      });

      alert("Order status updated ✅");
      navigate("/hoteladmin/orders");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>🔄 Update Order Status</h2>

      <input
        type="number"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setStatus(e.target.value)}>
        <option value="">Select Status</option>
        <option value="PREPARING">PREPARING</option>
        <option value="READY">READY</option>
        <option value="COLLECTED">COLLECTED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <br /><br />
      <button onClick={handleUpdate}>Update Status</button>
      <br /><br />

      <button onClick={() => navigate("/admin")}>⬅ Back</button>
    </div>
  );
}

export default UpdateOrderStatus;