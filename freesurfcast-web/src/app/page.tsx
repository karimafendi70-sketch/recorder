"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "./LanguageProvider";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { usePageView } from "@/lib/trackClient";

export default function Home() {
  const { t } = useLanguage();
  usePageView();

  const stepsRef = useRef<HTMLDivElement>(null);

  function handleHowItWorks() {
    stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="stack-lg">
      {/* -- App-style Hero -- */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-tagline">{t("home.hero.tagline")}</p>
          <h1 className="hero-headline">{t("home.hero.title")}</h1>
          <p className="hero-sub">{t("home.hero.subtitle")}</p>
          <div className="hero-actions">
            <Link href="/forecast" className="btn btn-primary btn-lg">
              {t("home.hero.ctaPrimary")}
            </Link>
            <button type="button" className="btn btn-ghost btn-lg" onClick={handleHowItWorks}>
              {t("home.hero.ctaSecondary")}
            </button>
          </div>
        </div>
      </section>

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
        <div className="about-ideas" ref={stepsRef}>
          <h3>{t("home.stepsTitle")}</h3>
          <ol className="steps-list">
            <li><span className="step-icon">📍</span> {t("home.step1")}</li>
            <li><span className="step-icon">⚙️</span> {t("home.step2")}</li>
            <li><span className="step-icon">📊</span> {t("home.step3")}</li>
          </ol>
          <p className="morocco-hint">{t("home.moroccoHint")}</p>
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
        <FeedbackWidget />
      </div>
    </section>
  );
}
