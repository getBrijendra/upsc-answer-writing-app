"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Home, PenTool, Brain, BarChart3, User, FileText, LogOut, Menu, X } from "lucide-react"
import CreditDisplay from "@/components/credit-display"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/practice", label: "Practice", icon: PenTool },
    { href: "/mcq", label: "MCQ Generator", icon: Brain },
    { href: "/progress", label: "Progress", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/essay-writing", label: "Essay Writing", icon: FileText },
    { href: "/pricing", label: "Buy Credits", icon: User },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-black hover:text-gray-700 transition-colors cursor-pointer"
          >
            Lemura
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-black text-white hover:bg-gray-800"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            <CreditDisplay />
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden cursor-pointer hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="space-y-2">
              <div className="px-3 py-2">
                <CreditDisplay />
              </div>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-black text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              <Button
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
