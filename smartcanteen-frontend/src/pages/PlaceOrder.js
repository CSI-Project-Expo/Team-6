import React, { useState } from "react";
import api from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

function PlaceOrder() {
  const [total, setTotal] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const hotel_id = params.get("hotel_id");
  const slot_id = params.get("slot_id");
  const user_id = sessionStorage.getItem("user_id");

  const placeOrder = async () => {
    if (!slot_id) {
      alert("Please select pickup slot first");
      return;
    }

    try {
      const res = await api.post("/student/order", {
        user_id,
        hotel_id,
        slot_id,
        total_amount: total,
        items: [
          {
            menu_item_id: 1,
            quantity: 1,
            price: total
          }
        ]
      });

      alert("Order placed. ID = " + res.data.order_id);
      navigate(`/track-order/${res.data.order_id}`);

    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="po-page">
      <div className="po-card">
        <h2>Place Order</h2>
        <p>Confirm your final payable amount to continue.</p>

        <input
          type="number"
          placeholder="Enter Total Amount"
          onChange={(e) => setTotal(e.target.value)}
        />

        <button onClick={placeOrder}>Confirm Order</button>
      </div>
    </div>
  );
}

export default PlaceOrder;
