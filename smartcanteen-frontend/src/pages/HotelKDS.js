import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [newAlertCount, setNewAlertCount] = useState(0);
  const [highlightedOrderIds, setHighlightedOrderIds] = useState([]);
  const [delayReasonByOrder, setDelayReasonByOrder] = useState({});
  const previousOrderIdsRef = useRef(new Set());

  const playNewOrderTone = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = 880;
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = 0.08;

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.22);
    } catch (e) {
      console.log("Audio alert not available", e);
    }
  };

  const fetchKdsData = useCallback(async () => {
    try {
      const res = await api.get("/hoteladmin/kds/my");
      const nextOrders = res.data.orders || [];

      const previousIds = previousOrderIdsRef.current;
      const currentIds = new Set(nextOrders.map((o) => o.order_id));
      const newlyArrived = nextOrders.filter(
        (o) => !previousIds.has(o.order_id) && o.status === "PLACED"
      );

      if (newlyArrived.length > 0) {
        setNewAlertCount(newlyArrived.length);
        setHighlightedOrderIds((prev) => [
          ...new Set([...prev, ...newlyArrived.map((o) => o.order_id)]),
        ]);
        playNewOrderTone();
        setTimeout(() => setNewAlertCount(0), 8000);
        setTimeout(() => {
          setHighlightedOrderIds((prev) =>
            prev.filter((id) => !newlyArrived.some((o) => o.order_id === id))
          );
        }, 30000);
      }

      previousOrderIdsRef.current = currentIds;
      setOrders(nextOrders);
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

  const moveOrder = async (orderId, currentStatus, priority) => {
    const statusFlow = ["PLACED", "PREPARING", "READY", "COLLECTED"];
    const index = statusFlow.indexOf(currentStatus);
    if (index < 0 || index === statusFlow.length - 1) return;

    const nextStatus = statusFlow[index + 1];
    const delayReason = (delayReasonByOrder[orderId] || "").trim();

    if ((priority === "URGENT" || priority === "CRITICAL") && !delayReason && currentStatus !== "READY") {
      alert("Select a delay reason for urgent/critical orders before moving status.");
      return;
    }

    try {
      await api.put("/hoteladmin/update-order", {
        order_id: orderId,
        status: nextStatus,
        delay_reason: delayReason,
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

      {newAlertCount > 0 && (
        <div className="kds-alert-banner">
          New incoming orders: {newAlertCount}
        </div>
      )}

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
                    className={`kds-card priority-${String(order.priority || "NORMAL").toLowerCase()} ${
                      highlightedOrderIds.includes(order.order_id) ? "kds-new-card" : ""
                    }`}
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

                    {order.status !== "COLLECTED" && (
                      <select
                        className="delay-select"
                        value={delayReasonByOrder[order.order_id] || ""}
                        onChange={(e) =>
                          setDelayReasonByOrder((prev) => ({
                            ...prev,
                            [order.order_id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Delay Reason (optional)</option>
                        <option value="High Rush">High Rush</option>
                        <option value="Ingredient Delay">Ingredient Delay</option>
                        <option value="Staff Shortage">Staff Shortage</option>
                        <option value="Equipment Issue">Equipment Issue</option>
                        <option value="Payment Hold">Payment Hold</option>
                        <option value="Other Operational Delay">Other Operational Delay</option>
                      </select>
                    )}

                    <button
                      disabled={order.status === "COLLECTED"}
                      onClick={() => moveOrder(order.order_id, order.status, order.priority)}
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
