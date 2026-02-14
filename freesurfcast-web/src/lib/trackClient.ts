/* ──────────────────────────────────────────────
 *  Client-side analytics helpers
 *
 *  trackEvent()  – fire-and-forget POST to /api/analytics
 *  usePageView() – hook that sends one page_view per mount
 *
 *  All calls are non-blocking; errors are silently
 *  swallowed so they never affect the user experience.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/LanguageProvider";
import type { Lang } from "@/app/translations";

/**
 * Send an analytics event to /api/analytics.
 * Non-blocking — errors are silently ignored.
 */
export function trackEvent(payload: Record<string, unknown>): void {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* silently ignore – analytics should never break the UI */
  });
}

/* ── Convenience wrappers ────────────────────── */

export function trackPageView(path: string, language: Lang): void {
  trackEvent({ type: "page_view", path, language });
}

export function trackSpotSelected(
  spotId: string,
  path: string,
  language: Lang
): void {
  trackEvent({ type: "spot_selected", spotId, path, language });
}

export function trackLanguageChanged(from: Lang, to: Lang): void {
  trackEvent({ type: "language_changed", from, to });
}

/* ── usePageView hook ────────────────────────── */

/**
 * Drop into any page component.
 * Fires one `page_view` event per mount (strict-mode safe).
 */
export function usePageView(): void {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackPageView(pathname, lang);
  }, [pathname, lang]);
}
