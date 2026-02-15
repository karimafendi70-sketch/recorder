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
        className={styles.detailsToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.detailsToggleIcon}>{open ? "▾" : "▸"}</span>
        <span>
          {open
            ? t("forecast.details.hide" as TranslationKey)
            : t("forecast.details.show" as TranslationKey)}
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
