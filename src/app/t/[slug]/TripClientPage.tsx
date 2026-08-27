"use client";

import { useEffect, useState } from "react";
import { DestinationWithStatus, Trip } from "@/types/destination";
import { DestinationCard } from "@/components/DestinationCard";
import { DestinationForm } from "@/components/DestinationForm";
import Link from "next/link";

interface TripClientPageProps {
  slug: string;
}

export function TripClientPage({ slug }: TripClientPageProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [destinations, setDestinations] = useState<DestinationWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchDestinations = async () => {
    try {
      const res = await fetch(`/api/trips/${slug}/destinations`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setTrip(data.trip);
      setDestinations(data.destinations);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load trip destinations";
      console.error("TripClientPage fetch error:", err, "status:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
    const interval = setInterval(fetchDestinations, 60000);
    return () => clearInterval(interval);
  }, [slug]);

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

  if (loading) {
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
          <p className="text-sm text-white/80 font-medium">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
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
        <div className="relative text-center animate-slide-up">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
            <span className="text-xl text-white">⚠️</span>
          </div>
          <p className="text-white/90 font-medium">{error || "Trip not found"}</p>
        </div>
      </div>
    );
  }

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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl text-charcoal-900 tracking-tight">
                  {trip.name}
                </h1>
                <p className="text-sm text-charcoal-500 mt-0.5">
                  {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 border border-charcoal-200 rounded-xl hover:border-charcoal-300 transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-slide-up">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-5 border border-white/20">
                <span className="text-4xl">📍</span>
              </div>
              <h3 className="font-display text-2xl text-white mb-2">
                No destinations scheduled yet
              </h3>
              <p className="text-sm text-white/80 max-w-sm">
                Check back later for exciting destinations on this trip.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  onToggleComplete={handleToggleComplete}
                  showCompanyActions={false}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
