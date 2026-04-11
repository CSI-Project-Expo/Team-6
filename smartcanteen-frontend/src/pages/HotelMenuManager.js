import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HotelMenuManager.css";

function HotelMenuManager() {
  const navigate = useNavigate();

  const hotelId = localStorage.getItem("hotel_id") || 1; // temporary
  const role = localStorage.getItem("role");

  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  // ðŸ” Role protection
  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [role, navigate]);

  // Fetch menu
  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/hoteladmin/menu/${hotelId}`
      );
      setMenu(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add menu item
  const handleAddItem = async () => {
    if (!itemName || !price) {
      alert("Enter item name and price");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/hoteladmin/menu", {
        hotel_id: hotelId,
        item_name: itemName,
        price: price
      });

      alert("Menu item added");

      setItemName("");
      setPrice("");
      fetchMenu();
    } catch (error) {
      console.log(error);
      alert("Failed to add item");
    }
  };

  // Toggle availability
  const toggleAvailability = async (menu_item_id, currentStatus) => {
    try {
      await axios.put("http://127.0.0.1:5000/hoteladmin/menu", {
        menu_item_id: menu_item_id,
        is_available: !currentStatus
      });

      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete item
  const deleteItem = async (menu_item_id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await axios.delete(
        `http://127.0.0.1:5000/hoteladmin/menu/${menu_item_id}`
      );
      if (res?.data?.message) {
        alert(res.data.message);
      }
      fetchMenu();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to delete item");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="hotel-menu-manager-page">
      <header className="hotel-menu-hero">
        <div>
          <p className="hero-kicker">Hotel Admin</p>
          <h2 className="hotel-menu-manager-header">Menu Manager</h2>
          <p className="hero-subtitle">Add items, set availability, and keep your menu tidy.</p>
        </div>

        <div className="hotel-menu-manager-actions">
          <button onClick={() => navigate("/hoteladmin")}>Back</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="hotel-menu-layout">
        <section className="menu-panel">
          <div className="panel-header">
            <h3>Add New Item</h3>
            <span className="panel-hint">Create or update your daily menu quickly.</span>
          </div>

          <div className="add-menu-manager-form">
            <label className="field">
              <span>Item Name</span>
              <input
                type="text"
                placeholder="e.g., Paneer Wrap"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Price</span>
              <input
                type="number"
                placeholder="e.g., 60"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>

            <button onClick={handleAddItem}>Add Item</button>
          </div>
        </section>

        <section className="menu-panel menu-list-panel">
          <div className="panel-header">
            <h3>Menu List</h3>
            <span className="panel-hint">{menu.length} items</span>
          </div>

          {menu.length === 0 && (
            <div className="menu-empty">
              <p>No menu items found yet.</p>
              <span>Add your first item to get started.</span>
            </div>
          )}

          <div className="menu-grid">
            {menu.map((item) => (
              <div key={item.menu_item_id} className="menu-item-card">
                <div className="menu-item-top">
                  <div>
                    <h4>{item.item_name}</h4>
                    <p className="menu-price">Rs {item.price}</p>
                  </div>
                  <span
                    className={
                      item.is_available ? "status-pill available" : "status-pill unavailable"
                    }
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="menu-item-actions">
                  <button
                    className="toggle-btn"
                    onClick={() => toggleAvailability(item.menu_item_id, item.is_available)}
                  >
                    {item.is_available ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.menu_item_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HotelMenuManager;

