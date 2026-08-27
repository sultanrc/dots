import { ENVIRONMENT } from "@/config/environment";
import { Database } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// *  membuat client supabase di sisi SERVER.
// *  menyimpan URL dan API key supabase.
// *  membuat konfigurasi cookies di sisi SERVER agar bisa mengelola cookies yang dikirim dari client.
// ! cookies di sisi SERVER tidak bisa diakses langsung dari client, sehingga perlu konfigurasi cookies agar bisa mengelola cookies yang dikirim dari client.

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    ENVIRONMENT.supabaseUrl!,
    ENVIRONMENT.supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
};
