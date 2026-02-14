/* ──────────────────────────────────────────────
 *  FreeSurfCast – Auth context (Supabase + offline fallback)
 *
 *  When NEXT_PUBLIC_SUPABASE_URL & _ANON_KEY are set:
 *    → uses Supabase Auth (magic-link OTP flow)
 *    → loads/creates a row in the `profiles` table
 *
 *  When env vars are missing:
 *    → falls back to the legacy localStorage mock auth
 *    → the app still works fully without a backend
 *
 *  TODO (Pakket A2): sync preferences, favorites and
 *       language to the Supabase profile.
 * ────────────────────────────────────────────── */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { defaultProfile, type Profile } from "@/lib/profile";
import { useLanguage } from "./LanguageProvider";

/* ── Public types ────────────────────────────── */

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  /** True while the initial session is being resolved. */
  loading: boolean;
  /** Legacy alias – same as `!loading` */
  isReady: boolean;
  /** Send a magic-link email (Supabase) or instant-login (mock). */
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  /** Legacy alias for signInWithEmail (used by old callers). */
  login: (email: string) => void;
  /** Sign the user out. */
  signOut: () => Promise<void>;
  /** Legacy alias for signOut. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Fallback (localStorage) for when Supabase is absent ─ */

const MOCK_STORAGE_KEY = "freesurfcast:user";

function loadMockUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.email) return { id: "mock", email: parsed.email };
    }
  } catch { /* ignore */ }
  return null;
}

/* ── Provider component ──────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const supabaseReady = isSupabaseConfigured();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Profile loader (Supabase) ────────────── */
  const loadProfile = useCallback(
    async (userId: string) => {
      if (!supabaseReady) return;
      try {
        const sb = getSupabase();
        const { data, error } = await sb
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.warn("[auth] Failed to load profile:", error.message);
          return;
        }

        if (data) {
          setProfile(data as Profile);
        } else {
          // First login – create a default profile row
          const newRow = defaultProfile(userId, lang);
          const { data: inserted, error: insertErr } = await sb
            .from("profiles")
            .insert(newRow)
            .select()
            .single();

          if (insertErr) {
            console.warn("[auth] Failed to create profile:", insertErr.message);
          } else {
            setProfile(inserted as Profile);
          }
        }
      } catch (err) {
        console.warn("[auth] Profile load error:", err);
      }
    },
    [lang, supabaseReady]
  );

  /* ── Supabase session bootstrap ───────────── */
  useEffect(() => {
    if (!supabaseReady) {
      // Mock fallback – defer state updates to avoid synchronous setState in effect
      const mock = loadMockUser();
      queueMicrotask(() => {
        setUser(mock);
        setLoading(false);
      });
      return;
    }

    const sb = getSupabase();
    let mounted = true;

    // 1) Read current session
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email ?? "",
        };
        setUser(u);
        loadProfile(u.id);
      }
      setLoading(false);
    });

    // 2) Listen for changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u: AuthUser = {
          id: session.user.id,
          email: session.user.email ?? "",
        };
        setUser(u);
        loadProfile(u.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseReady, loadProfile]);

  /* ── Actions ───────────────────────────────── */

  const signInWithEmail = useCallback(
    async (email: string): Promise<{ error?: string }> => {
      if (!supabaseReady) {
        // Mock login
        const u: AuthUser = { id: "mock", email };
        setUser(u);
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(u));
        return {};
      }

      const sb = getSupabase();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) return { error: error.message };
      return {};
    },
    [supabaseReady]
  );

  const signOut = useCallback(async () => {
    if (supabaseReady) {
      const sb = getSupabase();
      await sb.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(MOCK_STORAGE_KEY);
  }, [supabaseReady]);

  /* ── Context value ─────────────────────────── */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isReady: !loading,
      signInWithEmail,
      login: (email: string) => { signInWithEmail(email); },
      signOut,
      logout: () => { signOut(); },
    }),
    [user, profile, loading, signInWithEmail, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
