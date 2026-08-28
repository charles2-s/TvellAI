"use client";

import { useEffect, useState } from "react";
import { DestinationWithStatus } from "@/types/destination";

interface CountdownTimerProps {
  destination: DestinationWithStatus;
}

export function CountdownTimer({ destination }: CountdownTimerProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startTime = destination.start_time ? new Date(destination.start_time) : null;
  const endTime = destination.end_time ? new Date(destination.end_time) : null;

  if (!startTime || !endTime) {
    return (
      <span className="text-sm text-charcoal-400 italic">
        Not yet scheduled
      </span>
    );
  }

  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const nowMs = now.getTime();

  const diffToStart = startMs - nowMs;
  const diffToEnd = endMs - nowMs;

  const isStartingSoon =
    destination.status === "Upcoming" && diffToStart > 0 && diffToStart < 3600000;

  const isEndingSoon =
    destination.status !== "Completed" &&
    diffToEnd > 0 &&
    diffToEnd < 1800000;

  if (isStartingSoon) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse-soft">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Starting soon</span>
      </span>
    );
  }

  if (isEndingSoon) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse-soft">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>Ending soon</span>
      </span>
    );
  }

  let badgeClass = "bg-cream-200 text-charcoal-600";
  let icon = "⏱";
  let display = destination.time_display;

  if (destination.status === "Completed") {
    badgeClass = "bg-cream-300 text-charcoal-500 line-through";
    icon = "✓";
    display = "Completed";
  } else if (destination.status === "Upcoming") {
    badgeClass = "bg-forest-50 text-forest-700 border border-forest-200";
    icon = "🕐";
    const diff = diffToStart;
    if (diff > 0 && diff < 86400000) {
      display = `Starts in ${formatDurationShort(diff)}`;
    } else if (diff >= 86400000) {
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      display = `Starts in ${days}d ${hours}h`;
    }
  } else if (destination.status === "Active") {
    badgeClass = "bg-forest-50 text-forest-700 border border-forest-200";
    icon = "▶";
    const diff = diffToEnd;
    display = `${formatDurationShort(Math.max(0, diff))} remaining`;
  } else if (destination.status === "Passed") {
    badgeClass = "bg-cream-200 text-charcoal-500";
    icon = "◼";
    display = "Time elapsed";
  }

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${badgeClass}`}
      >
        <span>{icon}</span>
        <span>{display}</span>
      </span>
      {destination.status !== "Completed" && endTime && (
        <span className="text-[11px] text-charcoal-500">
          Ends {endTime.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}

function formatDurationShort(ms: number): string {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    const h = hours > 0 ? ` ${hours}h` : "";
    const m = minutes > 0 ? ` ${minutes}m` : "";
    return `${days}d${h}${m}`;
  }
  if (hours > 0) {
    const m = minutes > 0 ? ` ${minutes}m` : "";
    return `${hours}h${m}`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
