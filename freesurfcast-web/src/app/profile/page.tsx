import type { Metadata } from "next";
import { ProtectedRoute } from "../ProtectedRoute";
import { ProfileForm } from "./components/ProfileForm";
import styles from "./profile.module.css";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Set your skill level, wave preferences and condition weights to personalise surf scores.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <header className={styles.heroCard}>
          <p className={styles.heroEyebrow}>Profile</p>
          <h1 className={styles.heroTitle}>Your surf profile</h1>
          <p className={styles.heroSubtitle}>
            Set your skill level, wave preferences and condition weights to personalise scores.
          </p>
        </header>

        <ProfileForm />
      </section>
    </ProtectedRoute>
  );
}
