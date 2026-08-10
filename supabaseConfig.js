// supabaseConfig.js
// Replace the placeholder values with your actual Supabase project URL and anon public key.
// You can find them in your Supabase dashboard under Settings → API.

export const supabaseUrl = "https://psfmvozmxfsmjgdhncep.supabase.co";
export const supabaseAnonKey = "sb_publishable_CgaBKkzw6pj9ulOqM2wbxQ_3nT1P6-y";

// Initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/module/supabase.js";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
