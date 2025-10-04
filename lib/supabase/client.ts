// lib/supabase/client.ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Optional: set a predictable cookie name if you also use cookies.
    // { cookieOptions: { name: 'sb-auth' } }
  )
