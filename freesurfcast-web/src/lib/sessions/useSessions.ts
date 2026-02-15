"use client";

import { useCallback, useEffect, useState } from "react";
import type { SurfSession, SessionStats } from "./types";

/* ── Storage key ─────────────────────────────── */

const STORAGE_PREFIX = "freesurfcast:sessions:";

function storageKey(spotId: string): string {
  return `${STORAGE_PREFIX}${spotId}`;
}

/* ── Read / write helpers ────────────────────── */

function readSessions(spotId: string): SurfSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(spotId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(spotId: string, sessions: SurfSession[]): void {
  try {
    localStorage.setItem(storageKey(spotId), JSON.stringify(sessions));
  } catch {
    // quota exceeded — silently fail
  }
}

/* ── Stats helper ────────────────────────────── */

function computeStats(sessions: SurfSession[]): SessionStats {
  if (sessions.length === 0) {
    return { totalSessions: 0, avgRating: null, lastSessionDate: null, totalMinutes: 0 };
  }
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const avgRating = sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length;
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  return {
    totalSessions: sessions.length,
    avgRating: Math.round(avgRating * 10) / 10,
    lastSessionDate: sorted[0]?.date ?? null,
    totalMinutes,
  };
}

/* ── Hook ────────────────────────────────────── */

export function useSessions(spotId: string) {
  const [sessions, setSessions] = useState<SurfSession[]>([]);

  // Load on mount / spotId change
  useEffect(() => {
    setSessions(readSessions(spotId));
  }, [spotId]);

  const addSession = useCallback(
    (data: Omit<SurfSession, "id" | "spotId" | "createdAt">) => {
      const session: SurfSession = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        spotId,
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => {
        const next = [session, ...prev];
        writeSessions(spotId, next);
        return next;
      });
    },
    [spotId],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== sessionId);
        writeSessions(spotId, next);
        return next;
      });
    },
    [spotId],
  );

  const stats: SessionStats = computeStats(sessions);

  return { sessions, stats, addSession, deleteSession };
}
