"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()

      // This completes the login session exchange
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth error:", error)
        return
      }

      if (data.session) {
        // Redirect to dashboard once session is active
        router.push("/dashboard")
      } else {
        // No session found — redirect to login
        router.push("/auth/login")
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-slate-600 text-lg">Finishing sign in...</p>
    </div>
  )
}
