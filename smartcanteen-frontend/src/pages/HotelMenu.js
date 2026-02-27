import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./HotelMenu.css";

function HotelMenu() {
  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const hotelId = localStorage.getItem("hotel_id");

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/hoteladmin/menu/my");
      setMenu(res.data);
    } catch (error) {
      // Fallback for older backend route shape
      if (hotelId) {
        try {
          const fallbackRes = await api.get(`/hoteladmin/menu/${hotelId}`);
          setMenu(fallbackRes.data);
          return;
        } catch (fallbackError) {
          console.log(fallbackError);
        }
      }

      console.log(error);
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

    if (!itemName.trim() || !price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/hoteladmin/menu", {
        item_name: itemName.trim(),
        price: numericPrice,
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

  const deleteMenuItem = async (menuItemId) => {
    if (!window.confirm("Delete this menu item?")) {
      return;
    }

    try {
      await api.delete(`/hoteladmin/menu/${menuItemId}`);
      fetchMenu();
    } catch (error) {
      console.log(error);
      alert("Failed to delete item");
    }
  };

  const toggleAvailability = async (menuItemId, currentStatus) => {
    try {
      await api.put("/hoteladmin/menu", {
        menu_item_id: menuItemId,
        is_available: !currentStatus,
      });
      fetchMenu();
    } catch (error) {
      console.log(error);
      alert("Failed to update availability");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="hotel-menu-page">
      <h2 className="hotel-menu-header">Hotel Admin - Menu Management</h2>

      <div className="hotel-menu-actions">
        <button onClick={() => navigate("/hoteladmin/orders")}>View Orders</button>
        <button onClick={() => navigate("/hoteladmin")}>Back</button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h3>Add New Item</h3>
      <div className="add-menu-form">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addMenuItem}>Add Item</button>
      </div>

      <h3>Your Menu Items</h3>
      <div className="menu-table-wrapper">
        <table className="menu-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5">Loading menu...</td>
              </tr>
            )}
            {menu.map((item) => (
              <tr key={item.menu_item_id}>
                <td>{item.menu_item_id}</td>
                <td>{item.item_name}</td>
                <td>Rs {item.price}</td>
                <td>{item.is_available ? "Yes" : "No"}</td>
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
            {!loading && menu.length === 0 && (
              <tr>
                <td colSpan="5">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HotelMenu;
