import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HotelKDS.css";

const COLUMN_CONFIG = [
  { key: "PLACED", label: "New" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COLLECTED", label: "Collected" },
];

function HotelKDS() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKdsData = useCallback(async () => {
    try {
      const res = await api.get("/hoteladmin/kds/my");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load KDS board");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    fetchKdsData();
    const interval = setInterval(fetchKdsData, 12000);
    return () => clearInterval(interval);
  }, [role, navigate, fetchKdsData]);

  const groupedOrders = useMemo(() => {
    const groups = {
      PLACED: [],
      PREPARING: [],
      READY: [],
      COLLECTED: [],
    };

    for (const order of orders) {
      const key = (order.status || "").toUpperCase();
      if (groups[key]) {
        groups[key].push(order);
      }
    }
    return groups;
  }, [orders]);

  const moveOrder = async (orderId, currentStatus) => {
    const statusFlow = ["PLACED", "PREPARING", "READY", "COLLECTED"];
    const index = statusFlow.indexOf(currentStatus);
    if (index < 0 || index === statusFlow.length - 1) return;

    const nextStatus = statusFlow[index + 1];
    try {
      await api.put("/hoteladmin/update-order", {
        order_id: orderId,
        status: nextStatus,
      });
      fetchKdsData();
    } catch (error) {
      console.error(error);
      alert("Failed to update order");
    }
  };

  const getActionLabel = (status) => {
    if (status === "PLACED") return "Start Preparing";
    if (status === "PREPARING") return "Mark Ready";
    if (status === "READY") return "Mark Collected";
    return "Completed";
  };

  return (
    <div className="kds-page">
      <header className="kds-header">
        <div>
          <h1>Kitchen Display System</h1>
          <p>Live kitchen board with one-click workflow</p>
        </div>
        <div className="kds-actions">
          <button onClick={() => navigate("/hoteladmin/orders")}>Orders View</button>
          <button onClick={() => navigate("/hoteladmin")}>Dashboard</button>
          <button
            className="kds-logout"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <p className="kds-loading">Loading board...</p>
      ) : (
        <main className="kds-board">
          {COLUMN_CONFIG.map((column) => (
            <section key={column.key} className="kds-column">
              <div className="kds-column-head">
                <h2>{column.label}</h2>
                <span>{groupedOrders[column.key].length}</span>
              </div>

              <div className="kds-column-body">
                {groupedOrders[column.key].length === 0 && (
                  <div className="kds-empty">No orders</div>
                )}

                {groupedOrders[column.key].map((order) => (
                  <article
                    key={order.order_id}
                    className={`kds-card priority-${String(order.priority || "NORMAL").toLowerCase()}`}
                  >
                    <div className="kds-card-top">
                      <h3>#{order.order_id}</h3>
                      <span>{order.age_minutes} min</span>
                    </div>

                    <p><b>Student:</b> {order.student_name}</p>
                    <p><b>Amount:</b> Rs. {order.total_amount}</p>
                    <p><b>Slot:</b> {order.slot_time || "-"}</p>
                    <p><b>Token:</b> {order.token_code || "Generated"}</p>

                    {order.priority !== "NORMAL" && (
                      <div className={`priority-badge ${String(order.priority).toLowerCase()}`}>
                        {order.priority}
                      </div>
                    )}

                    <button
                      disabled={order.status === "COLLECTED"}
                      onClick={() => moveOrder(order.order_id, order.status)}
                    >
                      {getActionLabel(order.status)}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      )}
    </div>
  );
}

export default HotelKDS;
