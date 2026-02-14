"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { useLanguage } from "../LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, isReady, login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("guest@freesurfcast.app");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isReady && user) {
      router.push("/forecast");
    }
  }, [isReady, user, router]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }
    login(normalizedEmail);
    router.push("/forecast");
  };

  const onContinueAsGuest = () => {
    login("guest@freesurfcast.app");
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

          <label className="field">
            <span>{t("login.password")}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="btn btn-primary full-width">
            {t("login.submit")}
          </button>
        </form>

        <button type="button" className="btn btn-ghost full-width" onClick={onContinueAsGuest}>
          {t("login.guest")}
        </button>
      </article>
    </section>
  );
}
