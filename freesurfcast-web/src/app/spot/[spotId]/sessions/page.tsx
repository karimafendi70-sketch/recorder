"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";
import { useSessions } from "@/lib/sessions/useSessions";
import type { SurfSession } from "@/lib/sessions/types";
import styles from "../../spot.module.css";

/* ── Star rating helper ──────────────────────── */

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <span className={styles.sessStars} role={onChange ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${styles.sessStar} ${n <= value ? styles.sessStarFilled : ""}`}
          role={onChange ? "radio" : undefined}
          aria-checked={n <= value}
          onClick={onChange ? () => onChange(n) : undefined}
          style={onChange ? { cursor: "pointer" } : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}

/* ── Duration formatter ──────────────────────── */

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ── Stats Card ──────────────────────────────── */

function StatsCard({ spotId }: { spotId: string }) {
  const { t } = useLanguage();
  const { stats } = useSessions(spotId);

  if (stats.totalSessions === 0) return null;

  return (
    <div className={styles.sessStatsCard}>
      <div className={styles.sessStat}>
        <span className={styles.sessStatValue}>{stats.totalSessions}</span>
        <span className={styles.sessStatLabel}>{t("sessions.stats.total" as TranslationKey)}</span>
      </div>
      <div className={styles.sessStat}>
        <span className={styles.sessStatValue}>
          {stats.avgRating != null ? stats.avgRating.toFixed(1) : "—"}
        </span>
        <span className={styles.sessStatLabel}>{t("sessions.stats.avgRating" as TranslationKey)}</span>
      </div>
      <div className={styles.sessStat}>
        <span className={styles.sessStatValue}>{fmtDuration(stats.totalMinutes)}</span>
        <span className={styles.sessStatLabel}>{t("sessions.stats.totalTime" as TranslationKey)}</span>
      </div>
      <div className={styles.sessStat}>
        <span className={styles.sessStatValue}>{stats.lastSessionDate ?? "—"}</span>
        <span className={styles.sessStatLabel}>{t("sessions.stats.lastSession" as TranslationKey)}</span>
      </div>
    </div>
  );
}

/* ── Add Session Form ────────────────────────── */

function AddSessionForm({ onAdd }: { onAdd: (data: Omit<SurfSession, "id" | "spotId" | "createdAt">) => void }) {
  const { t } = useLanguage();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("08:00");
  const [duration, setDuration] = useState(90);
  const [board, setBoard] = useState("");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onAdd({
        date,
        startTime,
        durationMinutes: duration,
        board: board.trim(),
        rating,
        notes: notes.trim(),
      });
      // Reset form
      setDate(today);
      setStartTime("08:00");
      setDuration(90);
      setBoard("");
      setRating(3);
      setNotes("");
      setOpen(false);
    },
    [date, startTime, duration, board, rating, notes, onAdd, today],
  );

  if (!open) {
    return (
      <button
        type="button"
        className={styles.sessAddBtn}
        onClick={() => setOpen(true)}
      >
        + {t("sessions.addSession" as TranslationKey)}
      </button>
    );
  }

  return (
    <form className={styles.sessForm} onSubmit={handleSubmit}>
      <h3 className={styles.sessFormTitle}>{t("sessions.addSession" as TranslationKey)}</h3>

      <div className={styles.sessFormGrid}>
        {/* Date */}
        <label className={styles.sessFormField}>
          <span className={styles.sessFormLabel}>{t("sessions.field.date" as TranslationKey)}</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={styles.sessInput} />
        </label>

        {/* Start time */}
        <label className={styles.sessFormField}>
          <span className={styles.sessFormLabel}>{t("sessions.field.startTime" as TranslationKey)}</span>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={styles.sessInput} />
        </label>

        {/* Duration */}
        <label className={styles.sessFormField}>
          <span className={styles.sessFormLabel}>{t("sessions.field.duration" as TranslationKey)}</span>
          <input
            type="number"
            min={5}
            max={480}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            required
            className={styles.sessInput}
          />
        </label>

        {/* Board */}
        <label className={styles.sessFormField}>
          <span className={styles.sessFormLabel}>{t("sessions.field.board" as TranslationKey)}</span>
          <input
            type="text"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            placeholder={t("sessions.field.boardPlaceholder" as TranslationKey)}
            className={styles.sessInput}
          />
        </label>
      </div>

      {/* Rating */}
      <div className={styles.sessFormField}>
        <span className={styles.sessFormLabel}>{t("sessions.field.rating" as TranslationKey)}</span>
        <Stars value={rating} onChange={setRating} />
      </div>

      {/* Notes */}
      <label className={styles.sessFormField}>
        <span className={styles.sessFormLabel}>{t("sessions.field.notes" as TranslationKey)}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder={t("sessions.field.notesPlaceholder" as TranslationKey)}
          className={`${styles.sessInput} ${styles.sessTextarea}`}
        />
      </label>

      {/* Actions */}
      <div className={styles.sessFormActions}>
        <button type="submit" className={styles.sessSubmitBtn}>
          {t("sessions.save" as TranslationKey)}
        </button>
        <button type="button" className={styles.sessCancelBtn} onClick={() => setOpen(false)}>
          {t("sessions.cancel" as TranslationKey)}
        </button>
      </div>
    </form>
  );
}

/* ── Session Row ─────────────────────────────── */

function SessionRow({
  session,
  onDelete,
}: {
  session: SurfSession;
  onDelete: (id: string) => void;
}) {
  const { t, lang } = useLanguage();
  const dateStr = new Date(session.date + "T12:00:00").toLocaleDateString(lang, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className={styles.sessRow}>
      <div className={styles.sessRowMain}>
        <div className={styles.sessRowTop}>
          <span className={styles.sessRowDate}>{dateStr}</span>
          <span className={styles.sessRowTime}>{session.startTime}</span>
          <span className={styles.sessRowDuration}>{fmtDuration(session.durationMinutes)}</span>
          <Stars value={session.rating} />
        </div>
        {session.board && (
          <span className={styles.sessRowBoard}>🏄 {session.board}</span>
        )}
        {session.notes && (
          <p className={styles.sessRowNotes}>{session.notes}</p>
        )}
      </div>
      <button
        type="button"
        className={styles.sessDeleteBtn}
        onClick={() => onDelete(session.id)}
        aria-label={t("sessions.delete" as TranslationKey)}
        title={t("sessions.delete" as TranslationKey)}
      >
        ✕
      </button>
    </div>
  );
}

/* ── Page Component ──────────────────────────── */

export default function SessionsPage() {
  const params = useParams<{ spotId: string }>();
  const spotId = params.spotId;
  const { t } = useLanguage();
  const { sessions, addSession, deleteSession } = useSessions(spotId);

  return (
    <>
      {/* Stats */}
      <StatsCard spotId={spotId} />

      {/* Add session */}
      <AddSessionForm onAdd={addSession} />

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon}>📝</span>
          <p className={styles.emptyStateText}>
            {t("sessions.empty" as TranslationKey)}
          </p>
          <p className={styles.emptyStateHint}>
            {t("sessions.emptyHint" as TranslationKey)}
          </p>
        </div>
      ) : (
        <div className={styles.sessList}>
          {sessions.map((s) => (
            <SessionRow key={s.id} session={s} onDelete={deleteSession} />
          ))}
        </div>
      )}
    </>
  );
}
