/* ──────────────────────────────────────────────
 *  Supabase browser client (singleton)
 *
 *  Required env vars (.env.local):
 *    NEXT_PUBLIC_SUPABASE_URL      – your Supabase project URL
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY – the public anon/API key
 *
 *  These are public (safe for client bundles) and should
 *  NOT be prefixed with SUPABASE_SERVICE_ROLE_KEY.
 * ────────────────────────────────────────────── */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns a shared Supabase browser client.
 *
 * Throws at runtime (not build time) if the env vars are
 * missing, so builds succeed even without a .env.local file.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "[FreeSurfCast] Supabase is not configured.\n" +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.\n" +
        "See https://supabase.com/docs/guides/getting-started for setup instructions."
    );
  }

  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}

/**
 * Returns `true` when the required env vars are present.
 * Useful for graceful degradation: skip Supabase calls
 * when the backend isn't configured yet.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
