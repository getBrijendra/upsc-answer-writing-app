"use client"

import Link from "next/link"
import Image from "next/image"
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
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Lemura home"
            className="group flex items-center gap-3"
          >
            <div className="flex items-center justify-center mt-3">
              <Image
                src="/logo/lemura_logo.png"
                alt="Lemura logo"
                width={130}
                height={130}
                priority
              />
            </div>
            <span className="text-3xl font-bold tracking-tight text-gray-900">
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg text-gray-700 hover:text-black font-medium transition-all duration-200 hover:underline underline-offset-4 decoration-2 decoration-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          {showAuth && (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-lg text-black hover:text-gray-700 hover:bg-gray-100 px-5 py-2"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="text-lg bg-black text-white hover:bg-gray-800 hover:shadow-lg px-6 py-2.5 rounded-xl">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-4">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-lg text-gray-700 hover:text-black font-medium hover:bg-gray-50 py-2 px-2 rounded"
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
                      className="w-full justify-start text-lg text-black hover:text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full text-lg bg-black text-white hover:bg-gray-800 hover:shadow-lg rounded-xl">
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
