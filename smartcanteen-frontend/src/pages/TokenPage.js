import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function TokenPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  // 🔐 Safety check
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎟 Order Token</h2>

      <button onClick={handleLogout}>🚪 Logout</button>
      <button onClick={() => navigate(-1)}>⬅ Back</button>

      <hr />

      {loading ? (
        <p>Generating token...</p>
      ) : (
        <>
          <h3>Your Token Number:</h3>
          <h1 style={{ color: "green" }}>{token}</h1>
          <p>Please show this token at the counter.</p>
        </>
      )}

      <br />

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
  );
}

export default TokenPage;