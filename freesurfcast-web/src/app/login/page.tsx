"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, isReady, login } = useAuth();
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
        <h1>Sign in to FreeSurfCast</h1>
        <p className="muted">Access your profile-based surf forecasting dashboard.</p>

        <form onSubmit={onSubmit} className="stack-md">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="btn btn-primary full-width">
            Sign in
          </button>
        </form>

        <button type="button" className="btn btn-ghost full-width" onClick={onContinueAsGuest}>
          Continue as guest
        </button>
      </article>
    </section>
  );
}
