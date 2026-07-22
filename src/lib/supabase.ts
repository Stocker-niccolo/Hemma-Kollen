// Supabase-klient. Auth + Postgres + realtid + RLS för familjedelning.
// Sätt VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY i .env (se .env.example).

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True när miljön är konfigurerad — låter UI köra i demo-läge utan backend. */
export const harSupabase = Boolean(url && anonKey);

export const supabase = harSupabase
  ? createClient(url!, anonKey!)
  : null;
