import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [impact, setImpact] = useState(null);
  const [summary, setSummary] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, impactRes] = await Promise.all([
          api.get("/superadmin/dashboard"),
          api.get("/superadmin/impact-metrics"),
        ]);
        setSummary(summaryRes.data);
        setImpact(impactRes.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load super admin analytics");
      }
    };

    fetchData();
  }, []);

  const heatmapMax = useMemo(() => {
    if (!impact?.heatmap_14d) return 1;
    let maxValue = 1;
    for (const row of impact.heatmap_14d) {
      for (const cell of row) {
        if (cell > maxValue) maxValue = cell;
      }
    }
    return maxValue;
  }, [impact]);

  const cellOpacity = (value) => {
    if (!value) return 0.08;
    return 0.15 + (value / heatmapMax) * 0.85;
  };
  const slotLabels = impact?.heatmap_slot_labels || [];

  const formatHeatmapLabel = (label) => {
    if (!label) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
      const [year, month, day] = label.split("-");
      return `${day}/${month}/${year.slice(2)}`;
    }
    return label;
  };

  return (
    <div className="sa-dashboard">
      <header className="sa-header">
        <h1>Super Admin Portal</h1>
        <button className="sa-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="sa-hero">
        <h2>Proof of Impact Dashboard</h2>
        <p>Operational insights + management controls in one place</p>
      </section>

      <section className="sa-kpis">
        <div className="sa-kpi-card">
          <p>Avg Wait Time Saved</p>
          <h3>{impact ? `${impact.avg_wait_time_saved_minutes} min` : "--"}</h3>
        </div>
        <div className="sa-kpi-card">
          <p>Orders / Hour (Today)</p>
          <h3>{impact ? impact.orders_per_hour : "--"}</h3>
        </div>
        <div className="sa-kpi-card">
          <p>Collected On Time</p>
          <h3>{impact ? `${impact.collected_on_time_pct}%` : "--"}</h3>
        </div>
        <div className="sa-kpi-card">
          <p>Orders Today</p>
          <h3>{impact ? impact.orders_today : "--"}</h3>
        </div>
      </section>

      <section className="sa-kpis sa-kpis-secondary">
        <div className="sa-kpi-card secondary">
          <p>Total Users</p>
          <h3>{summary ? summary.total_users : "--"}</h3>
        </div>
        <div className="sa-kpi-card secondary">
          <p>Total Orders</p>
          <h3>{summary ? summary.total_orders : "--"}</h3>
        </div>
        <div className="sa-kpi-card secondary">
          <p>Total Hotels</p>
          <h3>{summary ? summary.total_hotels : "--"}</h3>
        </div>
      </section>

      <section className="sa-heatmap-wrap">
        <h2>
          {impact?.heatmap_mode === "HOUR"
            ? "Peak Time Heatmap (Last 14 Days)"
            : "Peak Slot Heatmap (Last 14 Days)"}
        </h2>
        <div className="sa-heatmap-grid">
          <div
            className="sa-heatmap-hours"
            style={{ gridTemplateColumns: `92px repeat(${slotLabels.length}, minmax(70px, 1fr))` }}
          >
            <span />
            {slotLabels.map((slot) => (
              <span key={slot}>{slot}</span>
            ))}
          </div>

          {impact?.heatmap_14d?.map((row, dayIndex) => (
            <div className="sa-heatmap-row" key={dayIndex}>
              <span className="sa-day-label">
                {formatHeatmapLabel(impact.heatmap_labels?.[dayIndex]) || `D${dayIndex + 1}`}
              </span>
              <div
                className="sa-row-cells"
                style={{ gridTemplateColumns: `repeat(${slotLabels.length}, minmax(70px, 1fr))` }}
              >
                {row.map((value, slotIndex) => (
                  <div
                    key={`${dayIndex}-${slotIndex}`}
                    className="sa-heat-cell"
                    title={`${value} orders`}
                    style={{ backgroundColor: `rgba(255, 107, 53, ${cellOpacity(value)})` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sa-delay-wrap">
        <h2>Delay Reason Analytics (Last 30 Days)</h2>
        <div className="sa-delay-list">
          {impact?.delay_reason_breakdown?.length ? (
            impact.delay_reason_breakdown.map((item) => {
              const maxCount = impact.delay_reason_breakdown[0]?.count || 1;
              const widthPct = Math.max(10, (item.count / maxCount) * 100);
              return (
                <div key={item.reason} className="sa-delay-item">
                  <div className="sa-delay-label">
                    <span>{item.reason}</span>
                    <b>{item.count}</b>
                  </div>
                  <div className="sa-delay-bar">
                    <div className="sa-delay-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="sa-no-delay-data">No delay events logged yet.</p>
          )}
        </div>
      </section>

      <section className="sa-cards">
        <div className="sa-card" onClick={() => navigate("/superadmin/add-hotel")}>
          <h3>Add Hotel</h3>
          <p>Register new hotels into SmartCanteen</p>
        </div>

        <div className="sa-card" onClick={() => navigate("/superadmin/create-hotel-admin")}>
          <h3>Create Hotel Admin</h3>
          <p>Create login accounts for hotel managers</p>
        </div>

        <div className="sa-card" onClick={() => navigate("/superadmin/assign-hotel-admin")}>
          <h3>Assign Hotel Admin</h3>
          <p>Link hotel admins to hotels</p>
        </div>

        <div className="sa-card" onClick={() => navigate("/superadmin/users")}>
          <h3>Manage Users</h3>
          <p>View and control all system users</p>
        </div>

        <div className="sa-card" onClick={() => navigate("/superadmin/view-hotels")}>
          <h3>View Hotels</h3>
          <p>Monitor all registered hotels</p>
        </div>
      </section>

      <footer className="sa-footer">
        <p>© 2026 SmartCanteen - Digital Food Ordering and Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default SuperAdminDashboard;
