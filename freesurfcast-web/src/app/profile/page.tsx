import type { Metadata } from "next";
import { ProtectedRoute } from "../ProtectedRoute";
import { ProfileForm } from "./components/ProfileForm";
import styles from "./profile.module.css";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Customise your skill level, wave preferences and condition weights to personalise your forecasts.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <header className={styles.heroCard}>
          <p className={styles.heroEyebrow}>Profile</p>
          <h1 className={styles.heroTitle}>Your preferences</h1>
          <p className={styles.heroSubtitle}>
            Customise how FreeSurfCast scores and ranks surf conditions for you.
          </p>
        </header>

        <ProfileForm />
      </section>
    </ProtectedRoute>
  );
}
