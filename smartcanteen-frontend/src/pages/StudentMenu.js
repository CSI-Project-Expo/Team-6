import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentMenu.css";

function StudentMenu() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("user_id"));
  const userName = localStorage.getItem("username") || "Student";

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const [menu, setMenu] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [queueStats, setQueueStats] = useState(null);
  const [slotRecommendation, setSlotRecommendation] = useState(null);

  useEffect(() => {
    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/student/hotels")
      .then((res) => setHotels(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;

    setLoadingMenu(true);
    setMenu([]);
    setSlots([]);
    setSelectedSlot("");
    setCartItems([]);

    axios
      .get(`http://127.0.0.1:5000/student/menu/${selectedHotel}`)
      .then((res) => setMenu(res.data))
      .catch(() => alert("Failed to load menu"));

    axios
      .get(`http://127.0.0.1:5000/student/pickup-slots/${selectedHotel}`)
      .then((res) => setSlots(res.data))
      .catch(() => alert("Failed to load slots"))
      .finally(() => setLoadingMenu(false));
  }, [selectedHotel]);

  useEffect(() => {
    if (!selectedHotel) {
      setQueueStats(null);
      return;
    }

    let isMounted = true;
    const fetchQueueStats = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/student/queue/${selectedHotel}`);
        if (isMounted) {
          setQueueStats(res.data);
        }
      } catch {
        if (isMounted) {
          setQueueStats(null);
        }
      }
    };

    fetchQueueStats();
    const interval = setInterval(fetchQueueStats, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedHotel]);

  useEffect(() => {
    if (!selectedHotel) {
      setSlotRecommendation(null);
      return;
    }

    let isMounted = true;
    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/student/slot-recommendation/${selectedHotel}`);
        if (!isMounted) return;
        setSlotRecommendation(res.data?.recommended_slot || null);
      } catch {
        if (isMounted) {
          setSlotRecommendation(null);
        }
      }
    };

    fetchRecommendation();
    const interval = setInterval(fetchRecommendation, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedHotel]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const addToCart = (item) => {
    const exists = cartItems.find((i) => i.menu_item_id === item.menu_item_id);

    if (exists) {
      setCartItems(
        cartItems.map((i) =>
          i.menu_item_id === item.menu_item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    if (!selectedHotel) return alert("Please select a hotel first");
    if (!selectedSlot) return alert("Please select a pickup slot");
    if (cartItems.length === 0) return alert("Your cart is empty");

    const orderData = {
      user_id: userId,
      hotel_id: Number(selectedHotel),
      slot_id: Number(selectedSlot),
      total_amount: totalAmount,
      items: cartItems.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/student/order",
        orderData
      );
      alert("Order placed successfully");
      navigate(`/token/${res.data.order_id}`);
    } catch {
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="menu-wrapper student-menu-page">
      <header className="menu-header student-menu-hero">
        <h1>SmartCanteen</h1>
        <p>Welcome {userName}! Order food and skip the queue.</p>

        <div className="menu-actions student-menu-actions">
          <button onClick={() => navigate("/my-orders")}>My Orders</button>
          <button onClick={() => navigate(-1)}>Back</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="hotel-select-bar">
        <h3>Choose Your Hotel</h3>

        {hotels.length === 0 && (
          <p className="empty-state">No hotels available right now.</p>
        )}

        <div className="hotel-cards-grid">
          {hotels.map((hotel) => {
            const isSelected = String(hotel.hotel_id) === selectedHotel;
            return (
              <button
                key={hotel.hotel_id}
                className={`hotel-card ${isSelected ? "active" : ""}`}
                onClick={() => {
                  setSelectedHotel(String(hotel.hotel_id));
                  setSelectedHotelName(hotel.hotel_name);
                }}
              >
                <span className="hotel-name">{hotel.hotel_name}</span>
                <span className="hotel-location">{hotel.location}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="menu-layout">
        <div className="menu-section">
          <h2>
            Menu{" "}
            {selectedHotelName && (
              <span style={{ color: "#2EC4B6" }}>
                ({selectedHotelName})
              </span>
            )}
          </h2>

          {!selectedHotel && (
            <p className="empty-state">
              Please select a hotel to explore menu items.
            </p>
          )}

          {loadingMenu && <p className="empty-state">Loading menu...</p>}

          {selectedHotel && menu.length === 0 && !loadingMenu && (
            <p className="empty-state">
              No menu items available for this hotel.
            </p>
          )}

          <div className="menu-grid">
            {menu.map((item) => (
              <div className="menu-card" key={item.menu_item_id}>
                <h3>{item.item_name}</h3>
                <p className="price">Rs. {item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h2>Your Cart ({cartItems.length})</h2>

          {queueStats && (
            <div className="queue-widget">
              <p><b>Live Queue:</b> {queueStats.active_orders} active orders</p>
              <p>
                <b>Load:</b>{" "}
                <span className={`load-badge ${String(queueStats.load_level || "").toLowerCase()}`}>
                  {queueStats.load_level}
                </span>
              </p>
              <p><b>Estimated Wait:</b> ~{queueStats.estimated_wait_minutes} min</p>
            </div>
          )}

          {cartItems.length === 0 && (
            <p className="empty-cart">
              Your cart is empty. Add some food.
            </p>
          )}

          {cartItems.map((item) => (
            <div className="cart-item" key={item.menu_item_id}>
              <span>
                {item.item_name} x {item.quantity}
              </span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <h3>Total: Rs. {totalAmount}</h3>

          <label>Pickup Slot</label>
          {slotRecommendation && (
            <div className="slot-recommendation">
              Recommended: {slotRecommendation.start_time} - {slotRecommendation.end_time}
              {" "}({slotRecommendation.estimated_wait_minutes} min est. wait)
            </div>
          )}
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            disabled={!selectedHotel}
          >
            <option value="">-- Choose Slot --</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.start_time} - {slot.end_time}
                {slotRecommendation && Number(slotRecommendation.slot_id) === Number(slot.slot_id) ? " (Recommended)" : ""}
              </option>
            ))}
          </select>

          <button className="confirm-btn" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 SmartCanteen | Fast | Simple | Smart Food Ordering</p>
      </footer>
    </div>
  );
}

export default StudentMenu;
