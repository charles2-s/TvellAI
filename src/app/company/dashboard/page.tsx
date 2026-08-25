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
    const newStatus = currentStatus === "Completed" ? "Passed" : "Completed";
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

  const handleFormSuccess = (destination: DestinationWithStatus) => {
    setShowForm(false);
    setDestinations((prev) => [...prev, destination]);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your trip destinations
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/t/demo-trip"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                View Public Trip
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
              >
                Log out
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Destination
            </h2>
            <DestinationForm
              companyId={companyId}
              onSuccess={handleFormSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {destinations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 mb-4">No destinations yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Add your first destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onToggleComplete={handleToggleComplete}
                showCompanyActions={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
