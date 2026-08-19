"use client";

import { DestinationWithStatus } from "@/types/destination";
import { CountdownTimer } from "./CountdownTimer";

interface DestinationCardProps {
  destination: DestinationWithStatus;
  onToggleComplete?: (id: string, currentStatus: string) => void;
  showCompanyActions?: boolean;
}

export function DestinationCard({
  destination,
  onToggleComplete,
  showCompanyActions = false,
}: DestinationCardProps) {
  const coverPhoto = destination.cover_photo || destination.photos[0] || null;
  const isCompleted = destination.status === "Completed";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={destination.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">📍</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white drop-shadow-md">
            {destination.name}
          </h3>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {destination.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          {destination.duration && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {destination.duration}
            </span>
          )}
          <CountdownTimer destination={destination} />
        </div>

        {destination.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {destination.description}
          </p>
        )}

        {showCompanyActions && onToggleComplete && (
          <div className="flex justify-end">
            <button
              onClick={() => onToggleComplete(destination.id, destination.status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isCompleted
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {isCompleted ? "Mark incomplete" : "Mark complete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
