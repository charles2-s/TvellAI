"use client";

import { useState, useEffect, useRef } from "react";
import { DestinationWithStatus, DestinationStoredStatus } from "@/types/destination";
import { suggestDurationLabel } from "@/lib/time";

interface DestinationFormProps {
  companyId: string;
  destination?: DestinationWithStatus | null;
  onSuccess?: (destination: DestinationWithStatus) => void;
  onCancel?: () => void;
}

export function DestinationForm({
  companyId,
  destination,
  onSuccess,
  onCancel,
}: DestinationFormProps) {
  const [name, setName] = useState(destination?.name || "");
  const [type, setType] = useState<DestinationWithStatus["type"]>(destination?.type || "Other");
  const [description, setDescription] = useState(destination?.description || "");
  const [startTime, setStartTime] = useState(
    destination?.start_time
      ? new Date(destination.start_time).toISOString().slice(0, 16)
      : ""
  );
  const [endTime, setEndTime] = useState(
    destination?.end_time
      ? new Date(destination.end_time).toISOString().slice(0, 16)
      : ""
  );
  const [photos, setPhotos] = useState<string[]>(destination?.photos || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [bucketError, setBucketError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/storage/ensure-bucket", { method: "POST" })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to initialize photo storage");
          });
        }
        return res.json();
      })
      .then(() => {
        setBucketError("");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "Failed to initialize photo storage";
        setBucketError(message);
        console.error("Bucket init error:", message);
      });
  }, []);

  const suggestedDuration = startTime && endTime
    ? suggestDurationLabel(new Date(startTime), new Date(endTime))
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const validPhotos = photos.filter(Boolean);
      const url = destination
        ? `/api/destinations/${destination.id}`
        : "/api/destinations";
      const method = destination ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          description,
          start_time: startTime || null,
          end_time: endTime || null,
          photos: validPhotos,
          status: (destination?.status === "Completed" ? "Completed" : "Upcoming") as DestinationStoredStatus,
          order: destination?.order ?? 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save destination");
      }

      const data = await res.json();
      onSuccess?.(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    const previewUrl = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, previewUrl]);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = `Upload failed with status ${res.status}`;
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (!data.url) {
        throw new Error("Upload succeeded but no URL was returned");
      }

      setPhotos((prev) => {
        const index = prev.findIndex((url) => url === previewUrl);
        if (index !== -1) {
          const next = [...prev];
          next[index] = data.url;
          return next;
        }
        return prev;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Photo upload error:", err);
      setUploadError(message);
      setPhotos((prev) => prev.filter((url) => url !== previewUrl));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-clay-50 text-clay-700 rounded-xl text-sm border border-clay-200">
          {error}
        </div>
      )}

      {bucketError && (
        <div className="p-4 bg-cream-200 text-charcoal-700 rounded-xl text-sm border border-cream-300">
          <strong>Storage setup issue:</strong> {bucketError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Place name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
          placeholder="e.g. Maasai Mara National Reserve"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as DestinationWithStatus["type"])}
          className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
        >
          <option value="Wildlife Park">Wildlife Park</option>
          <option value="Historical Site">Historical Site</option>
          <option value="Forest">Forest</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all resize-none"
          placeholder="Describe this destination..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
            Start date & time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
            End date & time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-cream-50 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all"
          />
        </div>
      </div>

      {suggestedDuration && (
        <div className="flex items-center gap-2 text-sm text-charcoal-600">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 font-medium border border-forest-200">
            {suggestedDuration}
          </span>
          <span>computed duration</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-charcoal-700 mb-1.5">
          Photos
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-charcoal-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100 disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-1 text-sm text-forest-700 font-medium">Uploading photo...</p>
        )}
        {uploadError && (
          <div className="mt-2 p-3 bg-clay-50 border border-clay-200 text-clay-700 rounded-lg text-sm">
            <strong>Upload failed:</strong> {uploadError}
          </div>
        )}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photos.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-clay-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex-1 px-4 py-2.5 bg-forest-700 text-white rounded-xl font-semibold hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-95 shadow-sm shadow-forest-900/10"
        >
          {saving ? "Saving..." : destination ? "Update" : "Add Destination"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-charcoal-200 text-charcoal-700 rounded-xl font-semibold hover:bg-cream-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
