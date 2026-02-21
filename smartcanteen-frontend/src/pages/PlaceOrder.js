import React, { useState } from "react";
import api from "../services/api";
import { useSearchParams } from "react-router-dom";

function PlaceOrder() {
  const [total, setTotal] = useState("");
  const [params] = useSearchParams();

  const hotel_id = params.get("hotel_id");
  const slot_id = params.get("slot_id");
  const user_id = localStorage.getItem("user_id");

  const placeOrder = async () => {
    const res = await api.post("/student/order", {
      user_id,
      hotel_id,
      slot_id,
      total_amount: total,
      items: []
    });

    alert("Order placed. ID = " + res.data.order_id);
  };

  return (
    <div>
      <h2>Place Order</h2>

      <input
        placeholder="Enter Total Amount"
        onChange={(e) => setTotal(e.target.value)}
      />

      <button onClick={placeOrder}>Confirm Order</button>
    </div>
  );
}

export default PlaceOrder;