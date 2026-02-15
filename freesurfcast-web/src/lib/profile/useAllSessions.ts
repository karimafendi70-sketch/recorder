/* ── Gather sessions across ALL spots ────────── */

"use client";

import { useEffect, useMemo, useState } from "react";
import type { SurfSession } from "@/lib/sessions/types";

const STORAGE_PREFIX = "freesurfcast:sessions:";

/**
 * Read all session arrays from localStorage by scanning
 * keys with the known prefix.
 */
function readAllSessions(): SurfSession[] {
  if (typeof window === "undefined") return [];
  const all: SurfSession[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        all.push(...parsed);
      }
    }
  } catch {
    // noop
  }
  return all;
}

/**
 * Hook that returns all sessions across every spot.
 * Re-reads on mount + when localStorage changes.
 */
export function useAllSessions() {
  const [sessions, setSessions] = useState<SurfSession[]>([]);

  useEffect(() => {
    setSessions(readAllSessions());

    // Re-read on storage events (from other tabs or manual changes)
    function onStorage(e: StorageEvent) {
      if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
        setSessions(readAllSessions());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const spotIds = useMemo(
    () => [...new Set(sessions.map((s) => s.spotId))],
    [sessions],
  );

  return { sessions, spotIds };
}
