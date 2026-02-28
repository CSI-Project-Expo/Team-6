import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upiRef, setUpiRef] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cashConfirmed, setCashConfirmed] = useState(false);

  const merchantVpa = "smartcanteen@upi";
  const upiUri = `upi://pay?pa=${merchantVpa}&pn=SmartCanteen&am=${amount || 0}&cu=INR&tn=Order-${orderId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/student/order/${orderId}`);
        if (!res.data) {
          alert("Order not found");
          navigate("/my-orders");
          return;
        }
        setAmount(Number(res.data.total_amount || 0));
      } catch (error) {
        console.log(error);
        alert("Failed to load order details");
        navigate("/my-orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!paymentMode) {
      alert("Select payment mode");
      return;
    }
    if (amount === null || amount <= 0) {
      alert("Invalid order amount");
      return;
    }

    const selectedMode = paymentMode.toUpperCase();
    const payload = {
      order_id: Number(orderId),
      amount,
      payment_mode: selectedMode,
    };

    if (selectedMode === "UPI") {
      if (!/^[A-Za-z0-9]{8,30}$/.test(upiRef.trim())) {
        alert("Enter valid UPI reference (8-30 letters/numbers)");
        return;
      }
      payload.upi_ref = upiRef.trim();
    }

    if (selectedMode === "CARD") {
      const cardDigits = cardNumber.replace(/\D/g, "");
      if (!cardName.trim()) {
        alert("Enter card holder name");
        return;
      }
      if (!/^\d{16}$/.test(cardDigits)) {
        alert("Enter valid 16-digit card number");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.trim())) {
        alert("Enter expiry as MM/YY");
        return;
      }
      if (!/^\d{3}$/.test(cardCvv.trim())) {
        alert("Enter valid 3-digit CVV");
        return;
      }
      payload.card_last4 = cardDigits.slice(-4);
    }

    if (selectedMode === "CASH") {
      if (!cashConfirmed) {
        alert("Please confirm cash payment at counter");
        return;
      }
      payload.cash_confirmed = true;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/payment", payload);

      if (res.data?.already_paid) {
        setMessage("Payment already completed for this order.");
      } else {
        setMessage("Payment successful.");
      }
      navigate("/my-orders");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 409) {
        alert("Payment already completed for this order.");
        navigate("/my-orders");
        return;
      }
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="payment-page">
      <header className="payment-header">
        <h1>SmartCanteen Payment</h1>
        <p>Complete your order securely and skip the queue</p>
        <div className="payment-actions">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={() => navigate("/my-orders")}>My Orders</button>
        </div>
      </header>

      <div className="payment-form">
        <h2>Payment Details</h2>
        <p>Order ID: {orderId}</p>
        <p>Total Amount: {loading ? "Loading..." : `Rs. ${amount}`}</p>

        <select onChange={(e) => setPaymentMode(e.target.value)} value={paymentMode}>
          <option value="">Select Payment Mode</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>

        {paymentMode.toUpperCase() === "UPI" && (
          <div className="mode-box">
            <p>Scan this QR using GPay / PhonePe / Paytm</p>
            <img className="upi-qr" src={qrUrl} alt="UPI QR Code" />
            <p className="upi-id">UPI ID: {merchantVpa}</p>
            <button className="link-btn" onClick={() => navigator.clipboard.writeText(upiUri)}>
              Copy UPI Payment Link
            </button>
            <input
              type="text"
              placeholder="Enter UPI Transaction Ref"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
            />
          </div>
        )}

        {paymentMode.toUpperCase() === "CARD" && (
          <div className="mode-box">
            <input
              type="text"
              placeholder="Card Holder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Card Number (16 digits)"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                setCardNumber(grouped);
              }}
            />
            <div className="inline-fields">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                  setCardExpiry(formatted);
                }}
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength={3}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              />
            </div>
            <p className="card-note">
              Demo mode: card details are validated in UI; only last 4 digits are sent.
            </p>
          </div>
        )}

        {paymentMode.toUpperCase() === "CASH" && (
          <div className="mode-box">
            <label className="cash-check">
              <input
                type="checkbox"
                checked={cashConfirmed}
                onChange={(e) => setCashConfirmed(e.target.checked)}
              />
              I will pay full cash amount at the counter.
            </label>
          </div>
        )}

        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Please wait..." : "Pay Now"}
        </button>

        {message && <p className="payment-message">{message}</p>}
      </div>

      <footer className="footer">
        <p>© 2026 SmartCanteen - Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default PaymentPage;
