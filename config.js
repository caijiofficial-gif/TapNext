// Supabase connection. The publishable key is safe to expose in the browser:
// your data is protected by the row level security rules in schema.sql.
// NEVER put the secret / service_role key in this file.
const SUPABASE_URL = "https://jplmkmvvdcfsvtqblghr.supabase.co";
const SUPABASE_KEY = "sb_publishable_T3k8wTCzR1raPGVeSO8LVg_KU-UNeol";
window.sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
