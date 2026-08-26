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
      if (!res.ok) throw new Error("Failed to load trip");
      const data = await res.json();
      setTrip(data.trip);
      setDestinations(data.destinations);
    } catch {
      setError("Failed to load trip destinations");
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 font-medium">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-slide-up">
          <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">⚠️</span>
          </div>
          <p className="text-rose-600 font-medium">{error || "Trip not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                {trip.name}
              </h1>
              <p className="text-sm text-stone-500 mt-0.5">
                {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl hover:border-stone-400 transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-up">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              No destinations scheduled yet
            </h3>
            <p className="text-sm text-stone-500 max-w-sm">
              Check back later for exciting destinations on this trip.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
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
  );
}
