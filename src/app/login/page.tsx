"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/company/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card border border-charcoal-100 p-8 sm:p-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-charcoal-500">
            Log in to manage your trips and destinations.
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
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-charcoal-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-forest-700 hover:text-forest-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
