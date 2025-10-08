"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function PageLoader() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)

    let minTimeElapsed = false
    let pageReady = false

    const minTimer = setTimeout(() => {
      minTimeElapsed = true
      if (pageReady) {
        setLoading(false)
      }
    }, 800) // Increased from 500ms to 800ms

    const checkPageReady = () => {
      // Wait for DOM to be ready and a bit more time for React hydration
      if (document.readyState === "complete") {
        pageReady = true
        if (minTimeElapsed) {
          setLoading(false)
        }
      }
    }

    checkPageReady()
    window.addEventListener("load", checkPageReady)
    document.addEventListener("readystatechange", checkPageReady)

    const maxTimer = setTimeout(() => {
      setLoading(false)
    }, 3000) // Maximum 3 seconds

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
      window.removeEventListener("load", checkPageReady)
      document.removeEventListener("readystatechange", checkPageReady)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-black animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse"></div>
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-black"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute mt-32 text-sm font-medium text-gray-600 animate-pulse">Loading...</div>
    </div>
  )
}
