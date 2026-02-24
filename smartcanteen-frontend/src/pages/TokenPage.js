import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TokenPage.css";

function TokenPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      alert("Please login again");
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    generateToken();
  }, [orderId]);

  const generateToken = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/token/${orderId}`
      );
      setToken(res.data.token);
    } catch (error) {
      console.log("Token error:", error);
      alert("Token generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-wrapper">

      {/* HERO */}
      <div className="token-hero">
        <h1>🎟 Order Token Generated</h1>
        <p>Show this token at the counter to collect your food</p>
      </div>

      {/* ACTION BAR */}
      <div className="token-actions">
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <button className="logout-btn" onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}>🚪 Logout</button>
      </div>

      {/* CONTENT */}
      <div className="token-content">

        {loading ? (
          <p className="info-text">⏳ Generating token...</p>
        ) : (
          <div className="token-card">

            <h3>Your Token Number</h3>
            <div className="token-number">{token}</div>
            <p className="token-note">
              Please present this token at the SmartCanteen counter.
            </p>

            <div className="token-buttons">
              <button onClick={() => navigate(`/payment/${orderId}`)}>
                💳 Proceed to Payment
              </button>

              <button onClick={() => navigate(`/order-status/${orderId}`)}>
                📦 Track Order
              </button>

              <button onClick={() => navigate("/my-orders")}>
                📜 My Orders
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>

    </div>
  );
}

export default TokenPage;