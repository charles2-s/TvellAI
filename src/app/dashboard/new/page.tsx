"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DestinationType } from "@/types/database";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const TYPES: DestinationType[] = [
  "Wildlife Park",
  "Historical Site",
  "Forest",
  "Other",
];

export default function NewDestination() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [type, setType] = useState<DestinationType>("Other");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .single();

    if (!company) {
      setError("Company not found.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("destinations")
      .insert({
        company_id: company.id,
        name,
        type,
        description: description || null,
        duration,
        photos,
        order: 0,
        status: "Upcoming",
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPhotos.push(dataUrl);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900"
      >
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-green-900">
        Add destination
      </h1>
      <p className="mt-1 text-sm text-green-700/80">
        Add a new stop to your itinerary.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-green-900">
            Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DestinationType)}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900">
            Duration
          </label>
          <input
            type="text"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 2 days"
            className="mt-1 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-900">
            Photos
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="mt-1 block w-full text-sm text-green-700 file:mr-4 file:rounded-full file:border-0 file:bg-green-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-800 hover:file:bg-green-200"
          />
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Upload ${i + 1}`}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save destination"}
        </button>
      </form>
    </div>
  );
}
