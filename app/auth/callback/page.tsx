// app/auth/callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Finishing sign in...')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        setStatus('Already signed in. Redirecting...')
        router.replace('/dashboard')
        return
      }

      const hasCode = typeof window !== 'undefined' && window.location.search.includes('code=')
      if (!hasCode) {
        setStatus('No auth code found. Redirecting to login...')
        router.replace('/auth/login')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-slate-600 dark:text-slate-300" />
        </motion.div>
        <p className="text-slate-700 dark:text-slate-300 text-lg font-medium text-center">
          {status}
        </p>
      </motion.div>
    </div>
  )
}
