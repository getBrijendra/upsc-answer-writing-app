"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Header from "./header"
import Footer from "./footer"
import Navigation from "./navigation"
import PageLoader from "./page-loader"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAuthPage = pathname?.startsWith("/auth")
  const isPublicPage =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms"

  // Show public header for: public pages OR pricing page when not authenticated
  const shouldShowPublicHeader = isPublicPage || (pathname === "/pricing" && !isAuthenticated)

  // Show auth navigation for: authenticated users on non-auth, non-public pages OR pricing page when authenticated
  const shouldShowAuthNav = isAuthenticated && !isAuthPage && !shouldShowPublicHeader

  if (loading && !isAuthPage && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageLoader />

      {/* Show Header for public pages, Navigation for authenticated pages */}
      {shouldShowPublicHeader && <Header />}
      {shouldShowAuthNav && <Navigation />}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer for all pages except auth */}
      {!isAuthPage && <Footer />}
    </div>
  )
}
