// script.js - simplified version for reliable Supabase connection
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

// Supabase credentials (hard‑coded for simplicity)
const SUPABASE_URL = "https://psfmvozmxfsmjgdhncep.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CgaBKkzw6pj9ulOqM2wbxQ_3nT1P6-y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: retry a Supabase request up to N times
async function withRetry(fn, attempts = 3, delay = 1000) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Load all students and render as pretty JSON
async function loadStudents() {
  try {
    const { data, error } = await withRetry(() =>
      supabase.from("students").select("*").order("id", { ascending: true })
    );
    if (error) throw error;
    const out = document.getElementById("output");
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    console.error(e);
    alert("Cannot connect to Supabase: " + (e.message || e));
  }
}

window.addEventListener("load", loadStudents);
