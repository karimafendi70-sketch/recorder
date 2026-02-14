/* ──────────────────────────────────────────────
 *  FeedbackWidget – in-product feedback form
 *  Client component: collects type, message,
 *  optional email and hidden context fields,
 *  then POSTs to /api/feedback.
 * ────────────────────────────────────────────── */

"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import type { FeedbackType } from "@/lib/feedback";
import styles from "./FeedbackWidget.module.css";

const TYPES: { value: FeedbackType; labelKey: TranslationKey }[] = [
  { value: "idea", labelKey: "feedback.type.idea" },
  { value: "bug", labelKey: "feedback.type.bug" },
  { value: "question", labelKey: "feedback.type.question" },
];

interface FeedbackWidgetProps {
  /** Optional spot ID (provided by Forecast / Insights / Map). */
  spotId?: string;
}

export function FeedbackWidget({ spotId }: FeedbackWidgetProps) {
  const { t, lang } = useLanguage();
  const pathname = usePathname();

  const [type, setType] = useState<FeedbackType>("idea");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      setStatus("sending");
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            message: message.trim(),
            email: email.trim() || undefined,
            pagePath: pathname,
            language: lang,
            spotId: spotId || undefined,
          }),
        });
        if (!res.ok) throw new Error();
        setStatus("success");
        setMessage("");
        setEmail("");
      } catch {
        setStatus("error");
      }
    },
    [type, message, email, pathname, lang, spotId]
  );

  /* After success, show a thank-you message */
  if (status === "success") {
    return (
      <div className={styles.widget}>
        <p className={styles.successMsg}>{t("feedback.success")}</p>
      </div>
    );
  }

  return (
    <form className={styles.widget} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{t("feedback.title")}</h3>

      {/* Type selector (pill buttons) */}
      <fieldset className={styles.typeGroup}>
        {TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.typePill} ${type === opt.value ? styles.typePillActive : ""}`}
            onClick={() => setType(opt.value)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </fieldset>

      {/* Message */}
      <label className={styles.label}>
        {t("feedback.messageLabel")}
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
          rows={3}
          required
        />
      </label>

      {/* Optional email */}
      <label className={styles.label}>
        {t("feedback.emailLabel")} <span className={styles.optional}>({t("feedback.optional")})</span>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={200}
        />
      </label>

      {/* Error banner */}
      {status === "error" && (
        <p className={styles.errorMsg}>{t("feedback.error")}</p>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === "sending" || !message.trim()}
      >
        {status === "sending" ? "…" : t("feedback.submit")}
      </button>
    </form>
  );
}
