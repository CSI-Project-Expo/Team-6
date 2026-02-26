import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css"; // Import CSS

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
    <div className="payment-page">
      <h2 className="payment-header">💳 Payment</h2>
      
      <div className="payment-form">
        <p>Order ID: {orderId}</p>

        <select onChange={(e) => setPaymentMode(e.target.value)} value={paymentMode}>
          <option value="">Select Payment Mode</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>

        <button onClick={handlePayment}>Pay Now</button>

        {message && <p className="payment-message">{message}</p>}
      </div>
    </div>
  );
}

export default PaymentPage;