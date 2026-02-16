"use client";

import { useState, type ReactNode } from "react";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import styles from "../../spot.module.css";

/* ── Props ───────────────────────────────────── */

interface Props {
  children: ReactNode;
  /** Start collapsed? Default = true */
  defaultOpen?: boolean;
}

/* ── Component ───────────────────────────────── */

export function ForecastDetailsSection({ children, defaultOpen = false }: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={styles.detailsSection}>
      <button
        className={`${styles.detailsToggle} ${open ? styles.detailsToggleOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.detailsToggleIcon}>{open ? "▾" : "▸"}</span>
        <span className={styles.detailsToggleLabel}>
          {open
            ? t("forecast.details.hideDetails" as TranslationKey)
            : t("forecast.details.showDetails" as TranslationKey)}
        </span>
        <span className={styles.detailsToggleBadge}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className={styles.detailsContent}>
          {children}
        </div>
      )}
    </section>
  );
}
