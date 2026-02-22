import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function TokenPage() {
  const { orderId } = useParams();
  const [token, setToken] = useState("");
  const handleLogout = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("role");

  navigate("/");
};
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    generateToken();
  }, []);

  const generateToken = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/token/${orderId}`
      );

      setToken(res.data.token);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Token generation failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🎟 Order Token</h2>
<button onClick={handleLogout}>🚪 Logout</button>
      {loading ? (
        <p>Generating token...</p>
      ) : (
        <>
          <h3>Your Token Number:</h3>
          <h1>{token}</h1>
          <p>Please show this token at the counter.</p>
        </>
      )}
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