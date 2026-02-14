"use client";

import { useLanguage } from "../LanguageProvider";
import styles from "./profile.module.css";

export function ProfileHero() {
  const { t } = useLanguage();

  return (
    <header className={styles.heroCard}>
      <p className={styles.heroEyebrow}>{t("nav.profile")}</p>
      <h1 className={styles.heroTitle}>{t("profile.title")}</h1>
      <p className={styles.heroSubtitle}>{t("profile.lead")}</p>
    </header>
  );
}
