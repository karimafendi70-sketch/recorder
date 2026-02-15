import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Language, surf preferences, alerts and advanced options.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
