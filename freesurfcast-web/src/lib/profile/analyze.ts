/* ── Profile analysis engine ─────────────────── */

import type { SurfSession } from "@/lib/sessions/types";
import type { SurfSpot } from "@/lib/spots/catalog";
import type { RatingBucket, SizeBand } from "@/lib/alerts/types";
import { RATING_ORDER, SIZE_ORDER } from "@/lib/alerts/types";
import type { ConditionSnapshot, ProfileInsights } from "./types";

/* ── Helpers ──────────────────────────────────── */

function heightToSizeBand(m: number): SizeBand {
  if (m < 0.3) return "tiny";
  if (m < 0.6) return "knee";
  if (m < 0.9) return "waist";
  if (m < 1.2) return "chest";
  if (m < 1.5) return "shoulder";
  if (m < 2.0) return "head";
  if (m < 3.0) return "overhead";
  return "doubleOverhead";
}

function scoreToRatingBucket(score: number): RatingBucket {
  if (score >= 8.5) return "epic";
  if (score >= 7) return "goodToEpic";
  if (score >= 5.5) return "good";
  if (score >= 4.5) return "fairToGood";
  if (score >= 3) return "fair";
  if (score >= 1.5) return "poorToFair";
  return "poor";
}

/**
 * Build condition snapshots from sessions + spot catalog.
 * Since we don't have historical forecast data, we use spot
 * baseline conditions as a proxy for typical surf conditions.
 */
export function buildSnapshots(
  sessions: SurfSession[],
  catalog: SurfSpot[],
): ConditionSnapshot[] {
  const spotMap = new Map(catalog.map((s) => [s.id, s]));

  return sessions.map((sess) => {
    const spot = spotMap.get(sess.spotId);
    const waveH = spot?.waveHeightM ?? 1.0;
    // Use the baseline scores to simulate a "typical" score at this spot
    const baseScore = spot
      ? Math.min(10, Math.max(1, waveH * 2 + (spot.wavePeriodS ?? 8) * 0.3))
      : 5;

    return {
      spotId: sess.spotId,
      spotName: spot?.name ?? sess.spotId,
      dayKey: sess.date,
      sizeBand: heightToSizeBand(waveH),
      ratingBucket: scoreToRatingBucket(baseScore),
      avgScore: baseScore,
      sessionRating: sess.rating,
    };
  });
}

/* ── Core analysis ────────────────────────────── */

/**
 * Analyse a user's session history to derive preferences.
 * Uses weighted scoring: sessions rated 4-5 get positive weight,
 * sessions rated 1-2 get negative weight.
 */
export function analyzeProfile(
  sessions: SurfSession[],
  catalog: SurfSpot[],
): ProfileInsights {
  const empty: ProfileInsights = {
    totalSessions: 0,
    avgSessionRating: 0,
    totalMinutes: 0,
    preferredSizeBands: [],
    avoidedSizeBands: [],
    preferredRatingBuckets: [],
    windPreference: { offshoreScore: 0, onshoreScore: 0 },
    surfacePreference: { cleanScore: 0, messyScore: 0 },
    topSpots: [],
    suggestions: [],
  };

  if (sessions.length === 0) return empty;

  const snapshots = buildSnapshots(sessions, catalog);
  const totalSessions = sessions.length;
  const avgSessionRating =
    sessions.reduce((s, sess) => s + sess.rating, 0) / totalSessions;
  const totalMinutes = sessions.reduce((s, sess) => s + (sess.durationMinutes || 0), 0);

  // ── Size band preference ──
  const sizeScores = new Map<SizeBand, { sum: number; count: number }>();
  for (const snap of snapshots) {
    if (!snap.sizeBand) continue;
    const entry = sizeScores.get(snap.sizeBand) ?? { sum: 0, count: 0 };
    // Weight: map 1-5 rating to -2..+2
    entry.sum += snap.sessionRating - 3;
    entry.count += 1;
    sizeScores.set(snap.sizeBand, entry);
  }

  const preferredSizeBands: ProfileInsights["preferredSizeBands"] = [];
  const avoidedSizeBands: ProfileInsights["avoidedSizeBands"] = [];
  for (const band of SIZE_ORDER) {
    const entry = sizeScores.get(band);
    if (!entry || entry.count === 0) continue;
    const avg = entry.sum / entry.count;
    if (avg > 0.3) preferredSizeBands.push({ sizeBand: band, score: avg });
    if (avg < -0.3) avoidedSizeBands.push({ sizeBand: band, score: avg });
  }
  preferredSizeBands.sort((a, b) => b.score - a.score);
  avoidedSizeBands.sort((a, b) => a.score - b.score);

  // ── Rating bucket preference ──
  const ratingScores = new Map<RatingBucket, { sum: number; count: number }>();
  for (const snap of snapshots) {
    const entry = ratingScores.get(snap.ratingBucket) ?? { sum: 0, count: 0 };
    entry.sum += snap.sessionRating - 3;
    entry.count += 1;
    ratingScores.set(snap.ratingBucket, entry);
  }
  const preferredRatingBuckets: ProfileInsights["preferredRatingBuckets"] = [];
  for (const bucket of RATING_ORDER) {
    const entry = ratingScores.get(bucket);
    if (!entry || entry.count === 0) continue;
    const avg = entry.sum / entry.count;
    if (avg > 0.1) preferredRatingBuckets.push({ bucket, score: avg });
  }
  preferredRatingBuckets.sort((a, b) => b.score - a.score);

  // ── Wind & surface (from spot baseline) ──
  const spotMap = new Map(catalog.map((s) => [s.id, s]));
  let offshoreSum = 0;
  let onshoreSum = 0;
  let windCount = 0;
  for (const snap of snapshots) {
    const spot = spotMap.get(snap.spotId);
    if (!spot) continue;
    const coastDeg = spot.coastOrientationDeg;
    const windDeg = spot.windDirectionDeg;
    const diff = (((windDeg - coastDeg) % 360) + 360) % 360;
    const weight = snap.sessionRating - 3;
    if (diff >= 120 && diff <= 240) {
      offshoreSum += weight;
    } else if (diff <= 60 || diff >= 300) {
      onshoreSum += weight;
    }
    windCount += 1;
  }

  // ── Top spots ──
  const spotGroups = new Map<string, { spotName: string; sum: number; count: number; minutes: number }>();
  for (const sess of sessions) {
    const snap = snapshots.find((s) => s.spotId === sess.spotId && s.dayKey === sess.date);
    const name = snap?.spotName ?? sess.spotId;
    const entry = spotGroups.get(sess.spotId) ?? { spotName: name, sum: 0, count: 0, minutes: 0 };
    entry.sum += sess.rating;
    entry.count += 1;
    entry.minutes += sess.durationMinutes || 0;
    spotGroups.set(sess.spotId, entry);
  }
  const topSpots = [...spotGroups.entries()]
    .map(([spotId, e]) => ({
      spotId,
      spotName: e.spotName,
      avgRating: e.sum / e.count,
      count: e.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating || b.count - a.count)
    .slice(0, 5);

  // ── Generate suggestions ──
  const suggestions: string[] = [];

  if (totalSessions >= 3 && avgSessionRating >= 3.5) {
    suggestions.push("profile.suggest.consistentSurfer");
  }
  if (preferredSizeBands.length > 0) {
    suggestions.push("profile.suggest.preferredSize");
  }
  if (avoidedSizeBands.length > 0) {
    suggestions.push("profile.suggest.avoidedSize");
  }
  if (offshoreSum > onshoreSum + 1) {
    suggestions.push("profile.suggest.prefersOffshore");
  }
  if (totalSessions >= 5 && topSpots.length > 0 && topSpots[0].avgRating >= 4) {
    suggestions.push("profile.suggest.favoriteSpot");
  }
  if (totalSessions < 3) {
    suggestions.push("profile.suggest.logMore");
  }

  return {
    totalSessions,
    avgSessionRating: Math.round(avgSessionRating * 10) / 10,
    totalMinutes,
    preferredSizeBands,
    avoidedSizeBands,
    preferredRatingBuckets,
    windPreference: {
      offshoreScore: windCount ? offshoreSum / windCount : 0,
      onshoreScore: windCount ? onshoreSum / windCount : 0,
    },
    surfacePreference: {
      // Simplified: assume offshore-loving surfers prefer clean
      cleanScore: windCount ? offshoreSum / windCount : 0,
      messyScore: windCount ? onshoreSum / windCount : 0,
    },
    topSpots,
    suggestions,
  };
}
