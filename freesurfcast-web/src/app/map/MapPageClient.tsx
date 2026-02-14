/* ──────────────────────────────────────────────
 *  MapPageClient – client wrapper for the map page
 *
 *  The Leaflet map MUST be loaded client-side
 *  (no SSR). We use next/dynamic for that.
 * ────────────────────────────────────────────── */

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLanguage } from "../LanguageProvider";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { usePageView } from "@/lib/trackClient";
import styles from "./map.module.css";

/* Lazy-load SpotMap with SSR disabled (Leaflet needs window) */
const SpotMap = dynamic(() => import("./SpotMap").then((m) => m.SpotMap), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        color: "var(--muted)",
        fontSize: "0.88rem",
      }}
    >
      Loading map…
    </div>
  ),
});

export function MapPageClient() {
  const { t } = useLanguage();
  usePageView();

  return (
    <section className={styles.mapPage}>
      <div className={styles.mapHero}>
        <p className={styles.mapEyebrow}>FreeSurfCast</p>
        <h1 className={styles.mapTitle}>{t("map.title")}</h1>
        <p className={styles.mapSubtitle}>{t("map.subtitle")}</p>
        <div className={styles.mapLinks}>
          <Link href="/forecast" className={styles.mapLink}>
            {t("nav.forecast")} →
          </Link>
          <Link href="/profile" className={styles.mapLink}>
            {t("nav.profile")}
          </Link>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <SpotMap />
      </div>

      <FeedbackWidget />
    </section>
  );
}
