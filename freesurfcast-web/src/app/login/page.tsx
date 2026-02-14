"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { useLanguage } from "../LanguageProvider";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const { user, isReady, signInWithEmail } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isMock = !isSupabaseConfigured();

  useEffect(() => {
    if (isReady && user) {
      router.push("/forecast");
    }
  }, [isReady, user, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setStatus("sending");
    setErrorMsg("");

    const result = await signInWithEmail(trimmed);
    if (result.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else if (isMock) {
      // Mock mode: instant login → redirect
      router.push("/forecast");
    } else {
      // Supabase magic link sent
      setStatus("sent");
    }
  };

  const onContinueAsGuest = async () => {
    await signInWithEmail("guest@freesurfcast.app");
    router.push("/forecast");
  };

  return (
    <section className="login-screen">
      <article className="card login-card">
        <div className="login-logo" aria-hidden>
          FS
        </div>
        <h1>{t("login.heading")}</h1>
        <p className="muted">{t("login.subtitle")}</p>

        {status === "sent" ? (
          <div className="login-success-msg">
            <p>{t("login.magicLinkSent")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="stack-md">
            <label className="field">
              <span>{t("login.email")}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            {errorMsg && <p className="login-error-msg">{errorMsg}</p>}

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={status === "sending"}
            >
              {status === "sending" ? "…" : t("login.sendMagicLink")}
            </button>
          </form>
        )}

        <button
          type="button"
          className="btn btn-ghost full-width"
          onClick={onContinueAsGuest}
        >
          {t("login.guest")}
        </button>
      </article>
    </section>
  );
}
