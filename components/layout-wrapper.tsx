"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Header from "./header"
import Footer from "./footer"
import Navigation from "./navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  // Determine if user is authenticated (simplified check)
  const isAuthPage = pathname?.startsWith("/auth")
  const isPublicPage = pathname === "/" || pathname === "/about" || pathname === "/pricing"
  const isAuthenticatedPage = !isAuthPage && !isPublicPage

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Show Header for public pages, Navigation for authenticated pages */}
      {isPublicPage && <Header />}
      {isAuthenticatedPage && <Navigation />}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer for all pages except auth */}
      {!isAuthPage && <Footer />}
    </div>
  )
}
