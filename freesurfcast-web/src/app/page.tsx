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
      {/* ── Hero ──────────────────────────────── */}
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
        <div className="hero-actions">
          <Link href="/forecast" className="btn btn-primary">
            Open Forecast →
          </Link>
          <Link href="/profile" className="btn btn-ghost">
            Set up your surf profile
          </Link>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem" }}>
          Your profile will personalise all scores and insights.
        </p>
      </div>

      {/* ── About ─────────────────────────────── */}
      <div className="about-card">
        <h2>About FreeSurfCast</h2>

        <div className="about-body">
          <p>
            FreeSurfCast is a profile-driven coastal surf forecasting tool. It
            takes your skill level, wave preferences and condition weights and
            translates raw forecast data into personalised scores — so you
            instantly know when and where to paddle out.
          </p>
          <p>
            Use <Link href="/forecast" className="about-link">Forecast</Link> to
            see time-slot scores for a single spot,{" "}
            <Link href="/insights" className="about-link">Insights</Link> to
            compare multiple spots side-by-side with heatmaps and timelines,
            and <Link href="/profile" className="about-link">Profile</Link> to
            fine-tune how conditions are weighted.
          </p>
          <p className="muted" style={{ fontSize: "0.84rem" }}>
            The app currently runs on mock forecast data — but the scoring
            engine, daypart logic and multi-spot comparison are fully
            functional.
          </p>
        </div>

        <div className="about-ideas">
          <h3>Key ideas</h3>
          <ul>
            <li><strong>Profile-driven scoring</strong> — conditions are weighted to your personal preferences.</li>
            <li><strong>Daypart intelligence</strong> — morning, midday, afternoon and evening scored separately.</li>
            <li><strong>Multi-spot comparison</strong> — rank and compare your favourite breaks at a glance.</li>
          </ul>
        </div>
      </div>

      {/* ── Feedback ──────────────────────────── */}
      <div className="feedback-card">
        <h2>Help improve FreeSurfCast</h2>
        <p>
          This project is actively evolving. Spotted a bug, have a feature
          idea, or just want to share your thoughts? Your feedback makes a
          real difference.
        </p>
        <div className="feedback-actions">
          <a
            href="mailto:you@example.com?subject=FreeSurfCast%20feedback"
            className="btn btn-primary"
          >
            Send feedback ✉
          </a>
          <a
            href="https://github.com/karimafendi70-sketch/recorder/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Open a GitHub issue →
          </a>
        </div>
      </div>
    </section>
  );
}
