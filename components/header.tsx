"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  showAuth?: boolean
}

export default function Header({ showAuth = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const publicNavItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blogs", label: "Blogs" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition-colors cursor-pointer">
            Lemura
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-black transition-all duration-200 font-medium cursor-pointer hover:underline underline-offset-4 decoration-2 decoration-black"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          {showAuth && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-black hover:text-gray-700 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-black text-white hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden cursor-pointer hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-700 hover:text-black transition-all duration-200 font-medium cursor-pointer hover:bg-gray-50 py-2 px-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {showAuth && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-black hover:text-gray-700 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
