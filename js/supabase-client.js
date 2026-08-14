/* ===========================================================
   THE FOREX PROGRAM — Supabase client
   Project URL + publishable (anon) key are safe to expose in
   frontend code — they are public-facing by design, gated by
   Row Level Security policies on the database side.
=============================================================== */

const SUPABASE_URL = "https://sltxydcvjhaaldokcmbv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_n6-pXfRl9Z_XbUdJn6PbGw_j-YW6nFn";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
