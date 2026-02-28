import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./HotelMenu.css";

function HotelMenu() {
  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const hotelId = localStorage.getItem("hotel_id");

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/hoteladmin/menu/my");
      setMenu(res.data);
    } catch (error) {
      if (hotelId) {
        try {
          const fallbackRes = await api.get(`/hoteladmin/menu/${hotelId}`);
          setMenu(fallbackRes.data);
          return;
        } catch (fallbackError) {
          console.log(fallbackError);
        }
      }
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }
    fetchMenu();
  }, [role, navigate, fetchMenu]);

  const addMenuItem = async () => {
    const numericPrice = Number(price);

    if (!itemName.trim() || !price || numericPrice <= 0) {
      alert("⚠ Please enter valid item name and price");
      return;
    }

    try {
      await api.post("/hoteladmin/menu", {
        item_name: itemName.trim(),
        price: numericPrice,
      });

      alert("✅ Menu item added successfully");
      setItemName("");
      setPrice("");
      fetchMenu();
    } catch {
      alert("❌ Failed to add item");
    }
  };

  const deleteMenuItem = async (menuItemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await api.delete(`/hoteladmin/menu/${menuItemId}`);
      if (res?.data?.message) {
        alert(res.data.message);
      }
      fetchMenu();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete item");
    }
  };

  const toggleAvailability = async (menuItemId, currentStatus) => {
    try {
      await api.put("/hoteladmin/menu", {
        menu_item_id: menuItemId,
        is_available: !currentStatus,
      });
      fetchMenu();
    } catch {
      alert("Failed to update availability");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Stats
  const totalItems = menu.length;
  const availableItems = menu.filter((i) => i.is_available).length;
  const unavailableItems = totalItems - availableItems;

  // Search filter
  const filteredMenu = menu.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hotel-menu-page">
      <div className="title-section">
      <h2 className="hotel-menu-header">🍽 SmartCanteen - Menu Management</h2>
      <p className="subtitle">Manage your food items, prices and availability</p>
</div>
      <div className="hotel-menu-actions">
        <button onClick={() => navigate("/hoteladmin/orders")}>📦 View Orders</button>
        <button onClick={() => navigate("/hoteladmin")}>⬅ Back</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* Stats */}
      <div className="menu-stats">
        <p>📊 Total Items: {totalItems}</p>
        <p>🟢 Available: {availableItems}</p>
        <p>🔴 Unavailable: {unavailableItems}</p>
      </div>

      {/* Add Item */}
      <h3>➕ Add New Food Item</h3>
      <div className="add-menu-form">
        <input
          type="text"
          placeholder="Enter Item Name (eg: Veg Burger)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addMenuItem}>Add Item</button>
      </div>

      {/* Search */}
      <input
        className="search-box"
        type="text"
        placeholder="🔍 Search menu item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>📋 Your Menu Items</h3>

      <div className="menu-table-wrapper">
        <table className="menu-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">⏳ Loading your menu...</td>
              </tr>
            )}

            {filteredMenu.map((item) => (
              <tr key={item.menu_item_id}>
                <td>{item.menu_item_id}</td>
                <td>{item.item_name}</td>
                <td>₹ {item.price}</td>
                <td>
                  {item.is_available ? (
                    <span className="available-badge">Available</span>
                  ) : (
                    <span className="unavailable-badge">Unavailable</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() =>
                      toggleAvailability(item.menu_item_id, item.is_available)
                    }
                  >
                    {item.is_available ? "Mark Unavailable" : "Mark Available"}
                  </button>
                  <button
                    className="menu-delete-btn"
                    onClick={() => deleteMenuItem(item.menu_item_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!loading && filteredMenu.length === 0 && (
              <tr>
                <td colSpan="5">🍔 No menu items found. Add your first item!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="hm-footer">
        <p>© 2026 🍽 SmartCanteen - Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default HotelMenu;
