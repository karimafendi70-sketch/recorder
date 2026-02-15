"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { SpotAlertProfile, RatingBucket } from "./types";

/* ── LocalStorage prefix ─────────────────────── */

const STORAGE_PREFIX = "freesurfcast:alerts:";

function key(spotId: string): string {
  return `${STORAGE_PREFIX}${spotId}`;
}

/* ── External-store helpers ──────────────────── */

let listeners: (() => void)[] = [];

function subscribe(cb: () => void) {
  listeners = [...listeners, cb];
  return () => { listeners = listeners.filter((l) => l !== cb); };
}

function notify() { listeners.forEach((l) => l()); }

/* ── Read / write ────────────────────────────── */

function readProfile(spotId: string): SpotAlertProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(spotId));
    if (!raw) return null;
    return JSON.parse(raw) as SpotAlertProfile;
  } catch { return null; }
}

function writeProfile(spotId: string, profile: SpotAlertProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) {
    localStorage.setItem(key(spotId), JSON.stringify(profile));
  } else {
    localStorage.removeItem(key(spotId));
  }
  notify();
}

/* ── Default profile factory ─────────────────── */

const DEFAULT_MIN_RATING: RatingBucket = "fairToGood";

export function defaultProfile(spotId: string): SpotAlertProfile {
  return {
    spotId,
    minRatingBucket: DEFAULT_MIN_RATING,
    minSizeBand: "waist",
    maxSizeBand: "overhead",
    preferOffshore: false,
  };
}

/* ── Hook ────────────────────────────────────── */

export function useAlertProfile(spotId: string) {
  const getSnapshot = useCallback(() => readProfile(spotId), [spotId]);
  const getServerSnapshot = useCallback(() => null as SpotAlertProfile | null, []);

  const profile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const save = useCallback(
    (next: SpotAlertProfile) => writeProfile(spotId, next),
    [spotId],
  );

  const remove = useCallback(
    () => writeProfile(spotId, null),
    [spotId],
  );

  return { profile, save, remove } as const;
}
