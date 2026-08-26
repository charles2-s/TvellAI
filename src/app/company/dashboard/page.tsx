"use client";

import { useEffect, useState } from "react";
import { DestinationWithStatus } from "@/types/destination";
import { DestinationCard } from "@/components/DestinationCard";
import { DestinationForm } from "@/components/DestinationForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [destinations, setDestinations] = useState<DestinationWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState<DestinationWithStatus | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [companyId, setCompanyId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!company) {
        router.push("/login");
        return;
      }

      setCompanyId(company.id);
      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      if (!res.ok) throw new Error("Failed to load destinations");
      const data = await res.json();
      setDestinations(data.data);
    } catch {
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      fetchDestinations();
      const interval = setInterval(fetchDestinations, 60000);
      return () => clearInterval(interval);
    }
  }, [checkingAuth]);

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Upcoming" : "Completed";
    const res = await fetch(`/api/destinations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const data = await res.json();
      setDestinations((prev) =>
        prev.map((d) => (d.id === id ? data.data : d))
      );
    }
  };

  const handleEdit = (destination: DestinationWithStatus) => {
    setEditingDestination(destination);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this destination? This action cannot be undone.");
    if (!confirmed) return;

    const res = await fetch(`/api/destinations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleFormSuccess = (destination: DestinationWithStatus) => {
    setShowForm(false);
    setEditingDestination(null);
    setDestinations((prev) => {
      const exists = prev.find((d) => d.id === destination.id);
      if (exists) {
        return prev.map((d) => (d.id === destination.id ? destination : d));
      }
      return [...prev, destination];
    });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDestination(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Company Dashboard
              </h1>
              <p className="text-sm text-stone-500 mt-0.5">
                Manage your trip destinations
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/t/demo-trip"
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl hover:border-stone-400 transition-colors"
              >
                View Public Trip
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-300 rounded-xl hover:border-rose-400 transition-colors"
              >
                Log out
              </button>
              <button
                onClick={() => {
                  setEditingDestination(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-all active:scale-95"
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 animate-slide-up">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-card border border-stone-200/70 p-6 sm:p-8 animate-slide-up">
            <h2 className="text-lg font-bold text-stone-900 mb-5">
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </h2>
            <DestinationForm
              companyId={companyId}
              destination={editingDestination}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              No destinations yet
            </h3>
            <p className="text-sm text-stone-500 max-w-sm mb-6">
              Get started by adding your first destination. Build an unforgettable trip experience for your travelers.
            </p>
            <button
              onClick={() => {
                setEditingDestination(null);
                setShowForm(true);
              }}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-all active:scale-95"
            >
              Add your first destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showCompanyActions={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
