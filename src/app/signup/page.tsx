"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AccountType = "company" | "personal";

export default function Signup() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("company");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let logoUrl: string | null = null;

      if (logoFile && accountType === "company") {
        const bucketRes = await fetch("/api/storage/ensure-bucket", { method: "POST" });
        if (!bucketRes.ok) {
          const data = await bucketRes.json();
          throw new Error(data.error || "Failed to initialize photo storage");
        }

        const formData = new FormData();
        formData.append("file", logoFile);

        const uploadRes = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Logo upload failed");
        }

        const uploadData = await uploadRes.json();
        logoUrl = uploadData.url || null;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          name,
          slug,
          email,
          password,
          website: accountType === "company" ? website || null : null,
          logoUrl: accountType === "company" ? logoUrl : null,
        }),
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
            Choose your account type to get started.
          </p>
        </div>

        <div className="flex rounded-xl bg-cream-100 p-1 mb-8">
          <button
            type="button"
            onClick={() => setAccountType("company")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              accountType === "company"
                ? "bg-forest-700 text-white shadow-sm"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            Company
          </button>
          <button
            type="button"
            onClick={() => setAccountType("personal")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              accountType === "personal"
                ? "bg-forest-700 text-white shadow-sm"
                : "text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            Personal
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-clay-200 bg-clay-50 p-4 text-sm text-clay-700">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
              {accountType === "company" ? "Company name" : "Your name"}
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

          {accountType === "company" && (
            <>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                  Website URL <span className="text-charcoal-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
                  Logo <span className="text-charcoal-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-charcoal-200 rounded-xl hover:border-forest-400 hover:bg-forest-50/30 transition-colors">
                      <span className="text-sm text-charcoal-600 font-medium">
                        {logoFile ? "Change logo" : "Upload logo"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setLogoFile(file);
                      }}
                    />
                  </label>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-12 h-12 rounded-lg object-cover border border-charcoal-200"
                    />
                  )}
                </div>
              </div>
            </>
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
