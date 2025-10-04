// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Prepare the initial response
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // ✅ Apply new cookies to the response (not request)
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Define which routes are public (accessible without auth)
  const publicRoutes = ["/", "/about", "/pricing", "/privacy", "/terms", "/contact"]
  const isPublic = publicRoutes.includes(request.nextUrl.pathname)
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")

  // Redirect unauthenticated users away from private routes
  if (!user && !isPublic && !isAuthRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/auth/login"
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
