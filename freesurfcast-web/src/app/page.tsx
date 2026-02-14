import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FreeSurfCast – Smart coastal surf forecasts",
  description:
    "Personal surf guidance with daypart scoring, heatmaps and timeline insights for your local breaks.",
};

export default function Home() {
  return (
    <section className="stack-lg">
      <div className="hero-panel">
        <p className="eyebrow">2026 Coastal Forecasting</p>
        <h1>FreeSurfCast</h1>
        <p className="hero-subtitle-text">
          Personal surf guidance built around your profile, conditions, and smart daypart scoring.
          Start with a quick forecast view and grow into deeper insights.
        </p>
        <div className="hero-keywords">
          <span>Forecast</span>
          <span>Heatmap</span>
          <span>Timeline</span>
          <span>Profile-driven</span>
        </div>
        <Link href="/forecast" className="btn btn-primary" style={{ justifySelf: "start" }}>
          Open Forecast →
        </Link>
      </div>
    </section>
  );
}
