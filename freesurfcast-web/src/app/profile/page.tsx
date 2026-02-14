import type { Metadata } from "next";
import { ProtectedRoute } from "../ProtectedRoute";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileHero } from "./ProfileHero";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Set your skill level, wave preferences and condition weights to personalise surf scores.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <section className="stack-lg">
        <ProfileHero />
        <ProfileForm />
      </section>
    </ProtectedRoute>
  );
}
