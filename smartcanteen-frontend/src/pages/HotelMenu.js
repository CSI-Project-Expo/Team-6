import React, { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./HotelMenu.css";

function HotelMenu() {
  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");
  const hotelId = sessionStorage.getItem("hotel_id");

  const fetchMenu = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
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
      if (showLoading) {
        setLoading(false);
      }
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
      alert("Please enter valid item name and price");
      return;
    }

    try {
      await api.post("/hoteladmin/menu", {
        item_name: itemName.trim(),
        price: numericPrice,
      });

      alert("Menu item added successfully");
      setItemName("");
      setPrice("");
      fetchMenu(false);
    } catch {
      alert("Failed to add item");
    }
  };

  const deleteMenuItem = async (menuItemId) => {
    setConfirmDeleteId(null);
    setDeletingIds((prev) => new Set(prev).add(menuItemId));
    const previousMenu = menu;
    setMenu((prev) => prev.filter((item) => item.menu_item_id !== menuItemId));

    try {
      const res = await api.delete(`/hoteladmin/menu/${menuItemId}`);
      // If backend archives instead of deleting, keep it hidden per UI preference.
    } catch (error) {
      setMenu(previousMenu);
      alert(error?.response?.data?.message || "Failed to delete item");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(menuItemId);
        return next;
      });
    }
  };

  const toggleAvailability = async (menuItemId, currentStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(menuItemId));
    setMenu((prev) =>
      prev.map((item) =>
        item.menu_item_id === menuItemId
          ? { ...item, is_available: !currentStatus }
          : item
      )
    );

    try {
      await api.put("/hoteladmin/menu", {
        menu_item_id: menuItemId,
        is_available: !currentStatus,
      });
    } catch {
      setMenu((prev) =>
        prev.map((item) =>
          item.menu_item_id === menuItemId
            ? { ...item, is_available: currentStatus }
            : item
        )
      );
      alert("Failed to update availability");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(menuItemId);
        return next;
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const totalItems = menu.length;
  const availableItems = menu.filter((i) => i.is_available).length;
  const unavailableItems = totalItems - availableItems;

  const filteredMenu = menu.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hotel-menu-page">
      <header className="title-section">
        <div>
          <p className="title-kicker">Hotel Admin</p>
          <h2 className="hotel-menu-header">Menu Management</h2>
          <p className="subtitle">Manage your food items, prices and availability.</p>
        </div>
        <div className="hotel-menu-actions">
          <button onClick={() => navigate("/hoteladmin/orders")}>View Orders</button>
          <button onClick={() => navigate("/hoteladmin")}>Back</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="menu-stats">
        <div className="stat-card">
          <span>Total Items</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="stat-card available">
          <span>Available</span>
          <strong>{availableItems}</strong>
        </div>
        <div className="stat-card unavailable">
          <span>Unavailable</span>
          <strong>{unavailableItems}</strong>
        </div>
      </section>

      <section className="menu-controls">
        <div className="add-menu-form">
          <label>
            <span>Item Name</span>
            <input
              type="text"
              placeholder="e.g., Veg Burger"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
          <label>
            <span>Price (Rs)</span>
            <input
              type="number"
              placeholder="e.g., 60"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <button onClick={addMenuItem}>Add Item</button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search menu item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="menu-table-wrapper">
        <div className="table-header">
          <h3>Your Menu Items</h3>
          {loading && <span className="loading-pill">Loading...</span>}
        </div>

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
            {filteredMenu.map((item) => {
              const isUpdating = updatingIds.has(item.menu_item_id);
              const isDeleting = deletingIds.has(item.menu_item_id);
              const isBusy = isUpdating || isDeleting;
              const isConfirming = confirmDeleteId === item.menu_item_id;
              return (
              <tr key={item.menu_item_id} className={isBusy ? "row-busy" : ""} aria-busy={isBusy}>
                <td>{item.menu_item_id}</td>
                <td>{item.item_name}</td>
                <td>Rs {item.price}</td>
                <td>
                  {item.is_available ? (
                    <span className="available-badge">Available</span>
                  ) : (
                    <span className="unavailable-badge">Unavailable</span>
                  )}
                  {item.archived && (
                    <span className="archived-badge">Archived</span>
                  )}
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        toggleAvailability(item.menu_item_id, item.is_available)
                      }
                    >
                      {isUpdating
                        ? "Updating..."
                        : item.is_available
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </button>
                    {isConfirming ? (
                      <>
                        <button
                          className="menu-confirm-btn"
                          disabled={isDeleting}
                          onClick={() => deleteMenuItem(item.menu_item_id)}
                        >
                          {isDeleting ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          className="menu-cancel-btn"
                          disabled={isDeleting}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="menu-delete-btn"
                        disabled={isDeleting}
                        onClick={() => setConfirmDeleteId(item.menu_item_id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )})}

            {!loading && filteredMenu.length === 0 && (
              <tr>
                <td colSpan="5">No menu items found. Add your first item!</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="hm-footer">
        <p>© 2026 SmartCanteen - Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default HotelMenu;
