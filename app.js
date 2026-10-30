const config = window.BISPADO_SUPABASE_CONFIG || {};
const status = document.querySelector("#app-status");

const supabaseUrl = typeof config.url === "string" ? config.url.trim() : "";
const supabaseAnonKey = typeof config.anonKey === "string" ? config.anonKey.trim() : "";

if (!supabaseUrl || !supabaseAnonKey) {
  status.textContent = "Configure a URL e a chave pública do Supabase em supabase-config.js.";
} else if (typeof window.supabase?.createClient !== "function") {
  status.textContent = "Não foi possível carregar a biblioteca do Supabase.";
} else {
  window.bispadoSupabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  status.textContent = "Aplicação conectada ao Supabase.";
}
