"use client";

import { useState } from "react";
import { DestinationWithStatus } from "@/types/destination";
import { CountdownTimer } from "./CountdownTimer";

interface DestinationCardProps {
  destination: DestinationWithStatus;
  onToggleComplete?: (id: string, currentStatus: string) => void;
  onEdit?: (destination: DestinationWithStatus) => void;
  onDelete?: (id: string) => void;
  showCompanyActions?: boolean;
}

export function DestinationCard({
  destination,
  onToggleComplete,
  onEdit,
  onDelete,
  showCompanyActions = false,
}: DestinationCardProps) {
  const coverPhoto = destination.cover_photo || destination.photos[0] || null;
  const isCompleted = destination.status === "Completed";
  const [imgError, setImgError] = useState(false);

  const showImage = coverPhoto && !imgError;

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-card border border-stone-200/70 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
        isCompleted ? "shadow-card-completed opacity-90" : ""
      }`}
    >
      <div className="relative">
        {showImage ? (
          <img
            src={coverPhoto}
            alt={destination.name}
            onError={() => setImgError(true)}
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

        {showCompanyActions && (onEdit || onDelete) && (
          <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={() => onEdit(destination)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 text-stone-700 hover:bg-white hover:text-brand-700 transition-colors"
                title="Edit destination"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.305.382a.375.375 0 01-.42-.42l.382-2.305a4.5 4.5 0 011.13-1.897L16.862 4.487zM16.5 7.5l-1.5-1.5" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(destination.id)}
                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 text-stone-700 hover:bg-white hover:text-rose-700 transition-colors"
                title="Delete destination"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.061-.94-1.75-1.816-1.616L20.25 2.25M18 9h3.75M5.25 9h13.5" />
                </svg>
              </button>
            )}
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
