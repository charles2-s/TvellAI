import { DestinationComputedStatus } from "@/types/destination";

export function formatDuration(ms: number): string {
  if (ms <= 0) return "0m";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (days === 0 && hours === 0 && minutes === 0 && seconds > 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ") || "0m";
}

export function formatTimeRemaining(startTime: Date, endTime: Date): string {
  const now = new Date();
  const startMs = startTime.getTime();
  const endMs = endTime.getTime();
  const nowMs = now.getTime();

  if (nowMs < startMs) {
    const diff = startMs - nowMs;
    const days = Math.floor(diff / 86400000);
    if (days > 0) {
      const hours = Math.floor((diff % 86400000) / 3600000);
      return `Starts in ${days > 1 ? `${days} days` : "tomorrow"}`;
    }
    return `Starts in ${formatDuration(diff)}`;
  }

  if (nowMs >= startMs && nowMs <= endMs) {
    const diff = endMs - nowMs;
    return `${formatDuration(diff)} remaining`;
  }

  return "Completed";
}

export function formatTimeUntilStart(startTime: Date): string {
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();

  console.log("formatTimeUntilStart debug:", {
    now: now.toISOString(),
    start: startTime.toISOString(),
    diffMs: diff,
    diffMinutes: Math.floor(diff / 60000),
  });

  if (diff <= 0) return "Starting now";

  const days = Math.floor(diff / 86400000);
  if (days > 0) {
    const hours = Math.floor((diff % 86400000) / 3600000);
    const timeStr = startTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    if (days === 1) return `Starts tomorrow, ${timeStr}`;
    return `Starts in ${days} days, ${timeStr}`;
  }

  const hours = Math.floor(diff / 3600000);
  if (hours > 0) {
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `Starts in ${hours}h ${minutes}m`;
  }

  const minutes = Math.floor(diff / 60000);
  return `Starts in ${minutes}m`;
}

export function getDestinationStatus(
  startTime: Date | null,
  endTime: Date | null,
  manualStatus: string
): DestinationComputedStatus {
  if (manualStatus === "Completed") return "Completed";

  if (!startTime || !endTime) return "Upcoming";

   const now = new Date().getTime();
   const startMs = startTime.getTime();
   const endMs = endTime.getTime();

   console.log("getDestinationStatus debug:", {
     now: new Date(now).toISOString(),
     start: startTime.toISOString(),
     end: endTime.toISOString(),
     nowMs: now,
     startMs,
     endMs,
     diffToStart: startMs - now,
     result: now < startMs ? "Upcoming" : now >= startMs && now <= endMs ? "Active" : "Passed",
   });

   if (now < startMs) return "Upcoming";
   if (now >= startMs && now <= endMs) return "Active";
   return "Passed";
}

export function computeTimeDisplay(
  startTime: Date | null,
  endTime: Date | null,
  status: "Upcoming" | "Active" | "Passed" | "Completed"
): { time_remaining: string | null; time_display: string } {
  if (status === "Completed") {
    return { time_remaining: null, time_display: "Completed" };
  }

  if (!startTime || !endTime) {
    return { time_remaining: null, time_display: "Not yet scheduled" };
  }

  if (status === "Upcoming") {
    return {
      time_remaining: null,
      time_display: formatTimeUntilStart(startTime),
    };
  }

  if (status === "Active") {
    const diff = endTime.getTime() - new Date().getTime();
    return {
      time_remaining: formatDuration(Math.max(0, diff)),
      time_display: `${formatDuration(Math.max(0, diff))} remaining`,
    };
  }

  return { time_remaining: null, time_display: "Time elapsed" };
}

export function suggestDurationLabel(startTime: Date, endTime: Date): string {
  const diff = endTime.getTime() - startTime.getTime();
  if (diff <= 0) return "0m";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 && days === 0) parts.push(`${minutes}m`);

  return parts.join(" ") || "0m";
}
