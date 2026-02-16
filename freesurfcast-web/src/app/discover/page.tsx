"use client";

import Link from "next/link";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { useDiscoverData } from "@/lib/discover/useDiscoverData";
import { SpotSearch } from "@/app/components/SpotSearch";
import type { DayHighlight, SpotDiscoverSummary } from "@/lib/discover/types";
import styles from "./discover.module.css";

/* ── Rating colour mapping ───────────────────── */

const RATING_COLOR: Record<string, string> = {
  epic:        "var(--rating-epic)",
  goodToEpic:  "var(--rating-goodToEpic)",
  good:        "var(--rating-good)",
  fairToGood:  "var(--rating-fairToGood)",
  fair:        "var(--rating-fair)",
  poorToFair:  "var(--rating-poorToFair)",
  poor:        "var(--rating-poor)",
};

/* ── Cards ───────────────────────────────────── */

function TopDayCard({ day }: { day: DayHighlight }) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/spot/${day.spotId}/forecast`}
      className={styles.topDayCard}
    >
      {day.alertMatched && (
        <span className={styles.topDayAlert} aria-label="Alert match">🔔</span>
      )}
      <span
        className={styles.topDayStripe}
        style={{ background: RATING_COLOR[day.ratingBucket] ?? RATING_COLOR.poor }}
      />
      <div className={styles.topDayBody}>
        <span className={styles.topDaySpot}>{day.spotName}</span>
        <span className={styles.topDayCountry}>{day.country}</span>
        <div className={styles.topDayMeta}>
          <span className={styles.topDayLabel}>{day.dayLabel}</span>
          <span className={styles.topDayScore}>{day.avgScore.toFixed(1)}</span>
          <span
            className={styles.topDayRating}
            style={{ color: RATING_COLOR[day.ratingBucket] ?? RATING_COLOR.poor }}
          >
            {t(`rating.${day.ratingBucket}` as TranslationKey)}
          </span>
        </div>
        {day.sizeBand && (
          <span className={styles.topDaySize}>
            {t(`cond.size.${day.sizeBand}` as TranslationKey)}
          </span>
        )}
      </div>
    </Link>
  );
}

function SpotSummaryCard({ summary }: { summary: SpotDiscoverSummary }) {
  const { t } = useLanguage();
  const best = summary.bestDay;
  return (
    <Link
      href={`/spot/${summary.spotId}/forecast`}
      className={styles.spotCard}
    >
      <div className={styles.spotCardTop}>
        <span className={styles.spotCardName}>{summary.spotName}</span>
        <span className={styles.spotCardCountry}>{summary.country}</span>
      </div>
      {best ? (
        <div className={styles.spotCardBest}>
          <span
            className={styles.spotCardDot}
            style={{ background: RATING_COLOR[best.ratingBucket] ?? RATING_COLOR.poor }}
          />
          <span className={styles.spotCardDay}>{best.dayLabel}</span>
          <span className={styles.spotCardScore}>{best.avgScore.toFixed(1)}</span>
        </div>
      ) : (
        <span className={styles.spotCardNoData}>—</span>
      )}
      {summary.alertDayCount > 0 && (
        <span className={styles.spotCardAlertBadge}>
          🔔 {summary.alertDayCount} {t("discover.alertDays" as TranslationKey)}
        </span>
      )}
    </Link>
  );
}

/* ── Skeleton ────────────────────────────────── */

function DiscoverSkeleton() {
  return (
    <div className={styles.skeletonWrap}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

/* ── Page ────────────────────────────────────── */

export default function DiscoverPage() {
  const { t } = useLanguage();
  const { topDays, favoriteSummaries, isLoading } = useDiscoverData();

  return (
    <section className="stack-lg">
      {/* ── Hero ── */}
      <header className={styles.discoverHeader}>
        <h1 className={styles.discoverTitle}>
          {t("discover.title" as TranslationKey)}
        </h1>
        <p className={styles.discoverSubtitle}>
          {t("discover.subtitle" as TranslationKey)}
        </p>
      </header>

      {/* ── Spot search ── */}
      <section className={styles.spotSearchSection}>
        <h2 className={styles.sectionTitle}>
          {t("discover.search.title" as TranslationKey)}
        </h2>
        <SpotSearch />
      </section>

      {/* ── Top Days ── */}
      <section>
        <h2 className={styles.sectionTitle}>
          {t("discover.topDays" as TranslationKey)}
        </h2>
        {isLoading ? (
          <DiscoverSkeleton />
        ) : topDays.length === 0 ? (
          <p className={styles.emptyHint}>
            {t("discover.noData" as TranslationKey)}
          </p>
        ) : (
          <div className={styles.topDayGrid}>
            {topDays.map((day) => (
              <TopDayCard key={`${day.spotId}-${day.dateKey}`} day={day} />
            ))}
          </div>
        )}
      </section>

      {/* ── Favourite Spots ── */}
      {favoriteSummaries.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>
            {t("discover.yourSpots" as TranslationKey)}
          </h2>
          <div className={styles.spotGrid}>
            {favoriteSummaries.map((s) => (
              <SpotSummaryCard key={s.spotId} summary={s} />
            ))}
          </div>
        </section>
      )}

      {/* ── Quick links ── */}
      <div className={styles.quickLinks}>
        <Link href="/forecast" className={styles.quickLink}>
          🌊 {t("discover.goForecast" as TranslationKey)}
        </Link>
        <Link href="/map" className={styles.quickLink}>
          🗺️ {t("discover.goMap" as TranslationKey)}
        </Link>
      </div>
    </section>
  );
}
