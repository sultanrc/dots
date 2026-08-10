import { ENVIRONMENT } from "@/config/environment";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// * sebagai penghubung REQUEST dan RESPONSE antara client dan server supabase.
// * sebagai penghubung antara client.ts dan server.ts.

// *  membuat client supabase di sisi BROWSER.
// *  menyimpan URL dan API key supabase.

export const supabaseProxy = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ! ini adalah standard kode langsung dari supabase, biasanya dicopy paste aja dari dokumentasi supabase.

  const supabase = createServerClient(
    ENVIRONMENT.supabaseUrl!,
    ENVIRONMENT.supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // mengecek status login pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // mengarahkan ke halaman login jika pengguna belum login dan mencoba mengakses halaman selain login.
  if (!user && !request.nextUrl.pathname.startsWith("/login")) {
    // const url = request.nextUrl.clone();
    // url.pathname = '/login';
    // return NextResponse.redirect(url);
  }

  return supabaseResponse;
};
