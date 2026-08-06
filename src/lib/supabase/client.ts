import { ENVIRONMENT } from "@/config/environment";
import { createBrowserClient } from "@supabase/ssr";

// *  membuat client supabase di sisi BROWSER.
// *  menyimpan URL dan API key supabase.

export const createClient = () =>
  createBrowserClient(ENVIRONMENT.supabaseUrl!, ENVIRONMENT.supabaseKey!);
// URL dan API key supabase diambil dari file .env.local dan disimpan di ENVIRONMENT.

// ! Tidak perlu konfigurasi cookies di sisi BROWSER karena di browser sudah ada API pengelola cookies.
