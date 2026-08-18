"use client";

import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    setLoading(true);
    const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    } else {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
