"use client";

import { useState } from "react";

export default function StatusToggle({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(status);

  const toggle = async () => {
    setLoading(true);
    const newStatus = current === "Completed" ? "Upcoming" : "Completed";
    const res = await fetch("/api/destinations/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setCurrent(newStatus);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        current === "Completed"
          ? "bg-green-200 text-green-800 hover:bg-green-300"
          : "bg-sand-200 text-sand-800 hover:bg-sand-300"
      } disabled:opacity-50`}
    >
      {current === "Completed" ? "✓ Completed" : "○ Mark as visited"}
    </button>
  );
}
