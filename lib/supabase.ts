// lib/supabase.ts
// One shared connection to our Supabase database.
// The keys come from .env.local, which is never uploaded to GitHub.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);