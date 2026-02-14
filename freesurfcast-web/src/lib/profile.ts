/* ──────────────────────────────────────────────
 *  FreeSurfCast – Profile type
 *
 *  Maps to the `profiles` table in Supabase.
 *
 *  SQL to create the table (run in the Supabase SQL editor):
 *
 *  CREATE TABLE IF NOT EXISTS public.profiles (
 *    id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *    display_name    text,
 *    default_language text NOT NULL DEFAULT 'en',
 *    home_spot_id    text,
 *    preferences     jsonb,
 *    favorites       text[] NOT NULL DEFAULT '{}',
 *    recent_spots    text[] NOT NULL DEFAULT '{}',
 *    created_at      timestamptz DEFAULT now(),
 *    updated_at      timestamptz DEFAULT now()
 *  );
 *
 *  -- Enable Row Level Security
 *  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 *
 *  -- Users can read & update their own profile
 *  CREATE POLICY "Users can view own profile"
 *    ON public.profiles FOR SELECT
 *    USING (auth.uid() = id);
 *
 *  CREATE POLICY "Users can update own profile"
 *    ON public.profiles FOR UPDATE
 *    USING (auth.uid() = id);
 *
 *  CREATE POLICY "Users can insert own profile"
 *    ON public.profiles FOR INSERT
 *    WITH CHECK (auth.uid() = id);
 *
 *  -- Auto-update `updated_at` on every row change
 *  CREATE OR REPLACE FUNCTION public.handle_updated_at()
 *  RETURNS trigger AS $$
 *  BEGIN
 *    NEW.updated_at = now();
 *    RETURN NEW;
 *  END;
 *  $$ LANGUAGE plpgsql;
 *
 *  CREATE TRIGGER on_profiles_updated
 *    BEFORE UPDATE ON public.profiles
 *    FOR EACH ROW
 *    EXECUTE FUNCTION public.handle_updated_at();
 *
 * ────────────────────────────────────────────── */

import type { Lang } from "@/app/translations";
import type { UserPreferences } from "./preferences";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

export interface Profile {
  id: string;
  display_name: string | null;
  default_language: Lang | null;
  /** Optional home/default spot – must match a SurfSpot.id */
  home_spot_id: string | null;
  /** Surf preferences (skill, wave range, conditions) – stored as JSONB */
  preferences: UserPreferences | null;
  /** Favourite spot IDs */
  favorites: string[];
  /** Recently viewed spot IDs (most-recent-first, max 6) */
  recent_spots: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Build a default profile row for a newly signed-up user.
 */
export function defaultProfile(userId: string, language: Lang): Partial<Profile> {
  return {
    id: userId,
    display_name: null,
    default_language: language,
    home_spot_id: null,
    preferences: null,
    favorites: [],
    recent_spots: [],
  };
}

/* ── Supabase helpers ────────────────────────── */

/**
 * Fetch a profile row by user ID. Returns `null` when not found.
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const sb = getSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.warn("[profile] fetch error:", error.message);
    return null;
  }
  return (data as Profile) ?? null;
}

/**
 * Upsert (insert or update) a profile row.
 * Only the provided fields are overwritten; others stay unchanged.
 */
export async function upsertProfile(
  userId: string,
  partial: Partial<Omit<Profile, "id" | "created_at">>
): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    console.warn("[profile] upsertProfile skipped – Supabase not configured");
    return null;
  }
  const sb = getSupabase();
  const { data, error } = await sb
    .from("profiles")
    .upsert({ id: userId, ...partial, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) {
    console.warn("[profile] upsert error:", error.message);
    return null;
  }
  return data as Profile;
}
