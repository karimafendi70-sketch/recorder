"use client";

import { useAuth } from "../AuthProvider";
import { useLanguage } from "../LanguageProvider";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import styles from "./profile.module.css";

export function ProfileHero() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const showSynced = user && user.id !== "mock" && isSupabaseConfigured();

  return (
    <header className={styles.heroCard}>
      <p className={styles.heroEyebrow}>{t("nav.profile")}</p>
      <h1 className={styles.heroTitle}>{t("profile.title")}</h1>
      <p className={styles.heroSubtitle}>{t("profile.lead")}</p>
      {showSynced && (
        <p className={styles.syncedHint}>{t("profile.synced")}</p>
      )}
    </header>
  );
}
