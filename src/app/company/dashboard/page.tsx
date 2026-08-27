"use client";

import { useEffect, useState } from "react";
import { DestinationWithStatus } from "@/types/destination";
import { DestinationCard } from "@/components/DestinationCard";
import { DestinationForm } from "@/components/DestinationForm";
import { ShareModal } from "@/components/ShareModal";
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
  const [tripSlug, setTripSlug] = useState("");
  const [showShare, setShowShare] = useState(false);
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
        .select("id, slug")
        .eq("id", user.id)
        .single();

      if (!company) {
        router.push("/login");
        return;
      }

      setCompanyId(company.id);

      const tripRes = await fetch("/api/trips/current");
      if (tripRes.ok) {
        const tripData = await tripRes.json();
        setTripSlug(tripData.trip?.slug || company.slug || "");
      } else {
        setTripSlug(company.slug || "");
      }

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
      <div className="min-h-screen relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-charcoal-950/40 pointer-events-none" />
        <div className="relative flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/80 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  };

  const publicTripUrl = typeof window !== "undefined"
    ? `${window.location.origin}/t/${tripSlug}`
    : "";

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-charcoal-950/30 pointer-events-none" />

      <div className="relative">
        <header className="bg-white/70 backdrop-blur-md border-b border-charcoal-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-charcoal-900 tracking-tight">
                  Company Dashboard
                </h1>
                <p className="text-sm text-charcoal-500 mt-0.5">
                  Manage your trip destinations
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/t/${tripSlug || "demo-trip"}`}
                  className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 border border-charcoal-200 rounded-xl hover:border-charcoal-300 transition-colors"
                >
                  View Public Trip
                </Link>
                <button
                  onClick={() => setShowShare(true)}
                  className="px-4 py-2 text-sm font-medium text-forest-700 hover:text-forest-800 border border-forest-300 rounded-xl hover:border-forest-400 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-clay-600 hover:text-clay-700 border border-clay-300 rounded-xl hover:border-clay-400 transition-colors"
                >
                  Log out
                </button>
                <button
                  onClick={() => {
                    setEditingDestination(null);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-forest-700 text-white rounded-xl text-sm font-semibold hover:bg-forest-800 transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-sm shadow-forest-900/10"
                >
                  Add Destination
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {error && (
            <div className="mb-6 p-4 bg-clay-50 text-clay-700 rounded-xl border border-clay-200 animate-slide-up">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-white rounded-3xl shadow-card border border-charcoal-100 p-6 sm:p-8 animate-slide-up">
              <h2 className="font-display text-2xl text-charcoal-900 mb-5">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-96 rounded-3xl" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-slide-up">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-5 border border-white/20">
                <span className="text-4xl">📍</span>
              </div>
              <h3 className="font-display text-2xl text-white mb-2">
                No destinations yet
              </h3>
              <p className="text-sm text-white/80 max-w-sm mb-8">
                Get started by adding your first destination. Build an unforgettable trip experience for your travelers.
              </p>
              <button
                onClick={() => {
                  setEditingDestination(null);
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-forest-700 text-white rounded-xl text-sm font-semibold hover:bg-forest-800 transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-sm shadow-forest-900/10"
              >
                Add your first destination
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {showShare && (
        <ShareModal
          url={publicTripUrl}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
