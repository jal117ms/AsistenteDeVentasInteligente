import { createServerClient as createServerClientSSR } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Creates a Supabase server client for server-side operations.
 * Important: Don't put this client in a global variable. Always create a new
 * client within each function when using it (especially with Fluid compute).
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerClientSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have proxy refreshing user sessions.
        }
      },
    },
  })
}

export async function createClient() {
  return createServerClient()
}
