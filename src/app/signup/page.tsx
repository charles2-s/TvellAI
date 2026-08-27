"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      router.push("/company/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-charcoal-100 p-8 sm:p-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-charcoal-500">
            Set up your company and start sharing trips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-clay-200 bg-clay-50 p-4 text-sm text-clay-700">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              Company name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              Trip link slug
            </label>
            <div className="flex rounded-xl border border-charcoal-200 bg-cream-50 overflow-hidden">
              <span className="flex items-center px-3 text-sm text-charcoal-500 bg-cream-100 border-r border-charcoal-200">
                trailshare.app/t/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-trip-name"
                className="w-full px-3 py-2.5 text-sm outline-none focus:border-forest-500 bg-transparent"
              />
            </div>
            <p className="mt-1.5 text-xs text-charcoal-500">
              Use letters, numbers, and hyphens only.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-forest-700 px-4 py-3 text-sm font-semibold text-white hover:bg-forest-800 disabled:opacity-50 transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-sm shadow-forest-900/10"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-forest-700 hover:text-forest-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
