"use client";

import { useMemo } from "react";
import type { SlotContext, SlotQuality } from "@/lib/scores";
import {
  analyseDayTrends,
  buildStripBlocks,
  pickDaySummaryKey,
  type DaySummaryTextKey,
} from "@/lib/forecast/dayTrends";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ────────────────────────────────────── */

interface Props {
  daySlots: SlotContext[];
  avgScore: number;
  scoreFn: (slot: SlotContext) => SlotQuality;
}

/* ── Component ────────────────────────────────── */

export function DaySummaryLine({ daySlots, avgScore, scoreFn }: Props) {
  const { t } = useLanguage();

  const summaryKey = useMemo<DaySummaryTextKey>(() => {
    const blocks = buildStripBlocks(daySlots, scoreFn);
    const trends = analyseDayTrends(daySlots);
    return pickDaySummaryKey(blocks, avgScore, trends);
  }, [daySlots, avgScore, scoreFn]);

  return (
    <p className={styles.daySummaryLine}>
      {t(summaryKey as TranslationKey)}
    </p>
  );
}
