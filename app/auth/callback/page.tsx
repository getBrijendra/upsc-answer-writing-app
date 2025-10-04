// app/auth/callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Finishing sign in...')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      // 1) If a session already exists, skip exchanging completely
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        setStatus('Already signed in. Redirecting...')
        router.replace('/dashboard')
        return
      }

      // 2) Only attempt exchange when there is a code in the URL
      const hasCode = typeof window !== 'undefined' && window.location.search.includes('code=')
      if (!hasCode) {
        setStatus('No auth code found. Redirecting to login...')
        router.replace('/auth/login')
        return
      }

      // 3) Perform the exchange (single-use code)
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      // Clean URL so refresh won’t try to re-exchange
      window.history.replaceState({}, document.title, window.location.pathname)

      if (error) {
        console.error('Supabase OAuth exchange error:', error)
        setStatus('Authentication failed. Redirecting...')
        router.replace('/auth/login?error=' + encodeURIComponent(error.message))
        return
      }

      setStatus('Success! Redirecting...')
      router.replace('/dashboard')
    }

    run()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-slate-600 text-lg">{status}</p>
    </div>
  )
}
