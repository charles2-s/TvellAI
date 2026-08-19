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
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const startTime = destination.start_time ? new Date(destination.start_time) : null;
  const endTime = destination.end_time ? new Date(destination.end_time) : null;

  if (!startTime || !endTime) {
    return (
      <span className="text-sm text-gray-400 italic">
        Not yet scheduled
      </span>
    );
  }

  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const nowMs = now.getTime();

  let badgeClass = "bg-gray-100 text-gray-600";
  let icon = "⏱";
  let display = destination.time_display;

  if (destination.status === "Completed") {
    badgeClass = "bg-gray-200 text-gray-500 line-through";
    icon = "✓";
    display = "Completed";
  } else if (destination.status === "Upcoming") {
    badgeClass = "bg-blue-50 text-blue-600";
    icon = "🕐";
    const diff = startMs - nowMs;
    if (diff > 0 && diff < 86400000) {
      display = `Starts in ${formatDurationShort(diff)}`;
    } else if (diff >= 86400000) {
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      display = `Starts in ${days}d ${hours}h`;
    }
  } else if (destination.status === "Active") {
    badgeClass = "bg-green-50 text-green-600";
    icon = "▶";
    const diff = endMs - nowMs;
    display = `${formatDurationShort(Math.max(0, diff))} remaining`;
  } else if (destination.status === "Passed") {
    badgeClass = "bg-gray-100 text-gray-500";
    icon = "◼";
    display = "Time elapsed";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${badgeClass}`}
    >
      <span>{icon}</span>
      <span>{display}</span>
    </span>
  );
}

function formatDurationShort(ms: number): string {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    const h = hours > 0 ? ` ${hours}h` : "";
    return `${days}d${h}`;
  }
  if (hours > 0) {
    const m = minutes > 0 ? ` ${minutes}m` : "";
    return `${hours}h${m}`;
  }
  return `${minutes}m`;
}
