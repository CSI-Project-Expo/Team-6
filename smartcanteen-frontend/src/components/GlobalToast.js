import React, { useEffect, useState } from "react";

const EVENT_NAME = "app:notify";

export function notify(message, type = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { message: String(message || ""), type },
    })
  );
}

function GlobalToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onNotify = (event) => {
      const text = event?.detail?.message;
      if (!text) return;

      const toast = {
        id: Date.now() + Math.random(),
        message: text,
        type: event?.detail?.type || "info",
      };

      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3200);
    };

    window.addEventListener(EVENT_NAME, onNotify);
    return () => window.removeEventListener(EVENT_NAME, onNotify);
  }, []);

  return (
    <div className="toast-root" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default GlobalToast;
