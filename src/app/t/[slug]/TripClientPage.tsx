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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading trip...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error || "Trip not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{trip.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {destinations.length} destination{destinations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No destinations scheduled yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
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
