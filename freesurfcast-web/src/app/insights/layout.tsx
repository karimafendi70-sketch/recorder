import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Compare spots side-by-side with rankings, daypart heatmaps and timeline charts.",
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
