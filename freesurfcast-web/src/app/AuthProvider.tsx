/* ──────────────────────────────────────────────
 *  FreeSurfCast – Auth context (Supabase + offline fallback)
 *
 *  When NEXT_PUBLIC_SUPABASE_URL & _ANON_KEY are set:
 *    → uses Supabase Auth (magic-link OTP flow)
 *    → loads/creates a row in the `profiles` table
 *    → syncs language preference ↔ profile.default_language
 *
 *  When env vars are missing:
 *    → falls back to the legacy localStorage mock auth
 *    → the app still works fully without a backend
 * ────────────────────────────────────────────── */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  defaultProfile,
  fetchProfile,
  upsertProfile,
  type Profile,
} from "@/lib/profile";
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
  /** Merge partial data into the Supabase profile (no-op for mock/guest). */
  updateProfile: (partial: Partial<Omit<Profile, "id" | "created_at">>) => Promise<void>;
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
  const { lang, setLang } = useLanguage();
  const supabaseReady = isSupabaseConfigured();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── Ref: prevents language write-back loop after profile load ── */
  const langSyncedFromProfile = useRef(false);

  /* ── Profile loader (Supabase) ────────────── */
  const loadProfile = useCallback(
    async (userId: string) => {
      if (!supabaseReady) return;
      try {
        let loaded = await fetchProfile(userId);

        if (!loaded) {
          // First login – create a default profile row
          const newRow = defaultProfile(userId, lang);
          const sb = getSupabase();
          const { data: inserted, error: insertErr } = await sb
            .from("profiles")
            .insert(newRow)
            .select()
            .single();

          if (insertErr) {
            console.warn("[auth] Failed to create profile:", insertErr.message);
            return;
          }
          loaded = inserted as Profile;
        }

        setProfile(loaded);

        // Sync language FROM profile on initial load
        if (loaded.default_language && loaded.default_language !== lang) {
          langSyncedFromProfile.current = true;
          setLang(loaded.default_language);
        }
      } catch (err) {
        console.warn("[auth] Profile load error:", err);
      }
    },
    [lang, supabaseReady, setLang]
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

  /* ── Language → profile sync (debounced) ──── */
  const langSyncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (langSyncedFromProfile.current) {
      langSyncedFromProfile.current = false;
      return;
    }
    if (!user || user.id === "mock" || !profile) return;

    clearTimeout(langSyncTimer.current);
    langSyncTimer.current = setTimeout(() => {
      upsertProfile(user.id, { default_language: lang });
      setProfile((prev) => prev ? { ...prev, default_language: lang } : prev);
    }, 800);

    return () => clearTimeout(langSyncTimer.current);
  }, [lang, user, profile]);

  /* ── Actions ───────────────────────────────── */

  const updateProfileFn = useCallback(
    async (partial: Partial<Omit<Profile, "id" | "created_at">>) => {
      if (!user || user.id === "mock") return;
      const updated = await upsertProfile(user.id, partial);
      if (updated) setProfile(updated);
    },
    [user]
  );

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
      updateProfile: updateProfileFn,
    }),
    [user, profile, loading, signInWithEmail, signOut, updateProfileFn]
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
