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
    <div
      className={`group relative bg-white rounded-2xl shadow-card border border-stone-200/70 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
        isCompleted ? "shadow-card-completed opacity-90" : ""
      }`}
    >
      <div className="relative">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={destination.name}
            className={`w-full h-52 object-cover transition-all duration-300 ${
              isCompleted ? "grayscale brightness-95" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-stone-100 to-warm-200 flex items-center justify-center">
            <span className="text-5xl text-warm-400">📍</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300">
            <div className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm animate-bounce-soft">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold tracking-wide">Completed</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-stone-700 shadow-sm border border-white/50">
            {destination.type}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3
            className={`text-xl font-bold text-stone-900 leading-tight ${
              isCompleted ? "line-through text-stone-500" : ""
            }`}
          >
            {destination.name}
          </h3>
        </div>

        {destination.duration && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-warm-100 text-warm-700 border border-warm-200/60">
              {destination.duration}
            </span>
          </div>
        )}

        <div className="mb-4">
          <CountdownTimer destination={destination} />
        </div>

        {destination.description && (
          <p
            className={`text-sm leading-relaxed mb-4 line-clamp-2 ${
              isCompleted ? "text-stone-400" : "text-stone-500"
            }`}
          >
            {destination.description}
          </p>
        )}

        {showCompanyActions && onToggleComplete && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onToggleComplete(destination.id, destination.status)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isCompleted
                  ? "bg-warm-100 text-warm-700 hover:bg-warm-200 border border-warm-200 focus-visible:ring-warm-400"
                  : "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 focus-visible:ring-brand-400"
              }`}
            >
              {isCompleted ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Mark incomplete</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark complete</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
