"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on mount.
 * Renders nothing — just a side-effect component.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — non-critical, silently ignore
      });
    }
  }, []);

  return null;
}
