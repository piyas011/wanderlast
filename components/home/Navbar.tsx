"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, UserRound } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "Add Destinations", href: "/add-destinations" },
  { name: "My Bookings", href: "/my-bookings" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <nav className="fixed top-0 right-0 left-0 z-100 grid h-16 grid-cols-2 items-center bg-white/95 px-4 shadow-[0_4px_20px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-6 lg:grid-cols-3">
      {/* Desktop Navigation */}
      <div className="hidden items-center gap-5 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`text-sm font-semibold transition-colors ${
              isActive(link.href)
                ? "text-cyan-600"
                : "text-gray-700 hover:text-cyan-600"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="justify-self-start text-2xl font-extrabold tracking-tight text-cyan-600 lg:justify-self-center"
      >
        Wanderlast
      </Link>

      {/* Desktop Actions */}
      <div className="hidden items-center justify-end gap-5 lg:flex">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-cyan-600"
        >
          <UserRound size={17} />
          Profile
        </Link>

        <Link
          href="/login"
          className="text-sm font-semibold text-gray-700 transition hover:text-cyan-600"
        >
          Login
        </Link>

        <Link
          href="/sign-up"
          className="bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="justify-self-end rounded-md p-2 text-gray-800 transition hover:bg-gray-100 lg:hidden"
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute top-full right-0 left-0 z-50 border-t border-gray-100 bg-white p-4 shadow-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-100" />

            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <UserRound size={17} />
              Profile
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="border border-cyan-600 py-3 text-center text-sm font-semibold text-cyan-600"
              >
                Login
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="bg-cyan-600 py-3 text-center text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
