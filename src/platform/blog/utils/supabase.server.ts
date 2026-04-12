import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export function createClient(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
  const headers = new Headers();
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      cookies: {
        async get(key) {
          let value = cookies.find((row) => row.name === key);
          return value?.value || ""
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serializeCookieHeader(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serializeCookieHeader(key, "", options));
        },
      },
    },
  );
}