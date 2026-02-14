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
 *    default_language text DEFAULT 'en',
 *    home_spot_id    text,
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
 * ────────────────────────────────────────────── */

import type { Lang } from "@/app/translations";

export interface Profile {
  id: string;
  display_name: string | null;
  default_language: Lang | null;
  /** Optional home/default spot – must match a SurfSpot.id */
  home_spot_id: string | null;
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
  };
}
