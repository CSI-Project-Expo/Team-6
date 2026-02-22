import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState("");
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!paymentMode) {
      alert("Select payment mode");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/payment", {
        order_id: orderId,
        amount: 0, // you can fetch real amount later
        payment_mode: paymentMode
      });

      setMessage("Payment Successful ✅");
      navigate("/my-orders");
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };

  return (
    <div>
      <h2>💳 Payment</h2>
      <p>Order ID: {orderId}</p>

      <select onChange={(e) => setPaymentMode(e.target.value)}>
        <option value="">Select Payment Mode</option>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
      </select>

      <br /><br />

      <button onClick={handlePayment}>Pay Now</button>

      <p>{message}</p>
    </div>
  );
}

export default PaymentPage;