"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <section className="stack-lg">
      {/* -- Hero -- */}
      <div className="hero-panel">
        <p className="eyebrow">{t("home.eyebrow")}</p>
        <h1>{t("home.title")}</h1>
        <p className="hero-subtitle-text">{t("home.subtitle")}</p>
        <div className="hero-keywords">
          <span>{t("keywords.forecast")}</span>
          <span>{t("keywords.heatmap")}</span>
          <span>{t("keywords.timeline")}</span>
          <span>{t("keywords.profileDriven")}</span>
        </div>
        <div className="hero-actions">
          <Link href="/forecast" className="btn btn-primary">
            {t("home.openForecast")}
          </Link>
          <Link href="/profile" className="btn btn-ghost">
            {t("home.setupProfile")}
          </Link>
        </div>
        <p className="muted" style={{ fontSize: "0.82rem" }}>
          {t("home.profileHint")}
        </p>
      </div>

      {/* -- About -- */}
      <div className="about-card">
        <h2>{t("home.aboutTitle")}</h2>

        <div className="about-body">
          <p>{t("home.aboutP1")}</p>
          <p>{t("home.aboutP2")}</p>
          <p className="muted" style={{ fontSize: "0.84rem" }}>
            {t("home.aboutMock")}
          </p>
        </div>

        {/* 3-step quick-start */}
        <div className="about-ideas">
          <h3>{t("home.stepsTitle")}</h3>
          <ol className="steps-list">
            <li><span className="step-icon">📍</span> {t("home.step1")}</li>
            <li><span className="step-icon">⚙️</span> {t("home.step2")}</li>
            <li><span className="step-icon">📊</span> {t("home.step3")}</li>
          </ol>
        </div>

        <div className="about-ideas">
          <h3>{t("home.keyIdeas")}</h3>
          <ul>
            <li>{t("home.idea1")}</li>
            <li>{t("home.idea2")}</li>
            <li>{t("home.idea3")}</li>
          </ul>
        </div>
      </div>

      {/* -- Feedback -- */}
      <div className="feedback-card">
        <h2>{t("home.feedbackTitle")}</h2>
        <p>{t("home.feedbackBody")}</p>
        <div className="feedback-actions">
          <a
            href="mailto:you@example.com?subject=FreeSurfCast%20feedback"
            className="btn btn-primary"
          >
            {t("home.sendFeedback")}
          </a>
          <a
            href="https://github.com/karimafendi70-sketch/recorder/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {t("home.githubIssue")}
          </a>
        </div>
      </div>
    </section>
  );
}
