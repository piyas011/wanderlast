import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import Newsletter from "@/components/home/Newsletter"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "My Profile", href: "/profile" },
]

const supportLinks = [
  { label: "Help Center", href: "/help-center" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Privacy Policy", href: "/privacy-policy" },
]

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.928-1.956 1.877v2.274h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 fill-none stroke-current"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-7.05l-5.524-7.223-6.32 7.223H.298l7.73-8.835L.75 2.25h7.227l4.99 6.599 5.277-6.599Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.39.48A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12c1.89.48 9.39.48 9.39.48s7.5 0 9.39-.48A3 3 0 0 0 23.5 17.8 31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-cyan-900/20 bg-[#071b32] text-slate-300">
      <div className="absolute top-0 left-1/4 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="mx-auto w-full max-w-360 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.75fr_1fr_0.75fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tight text-white"
            >
              Wanderlast
              <span className="mt-1 size-2 rounded-full bg-cyan-400" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Your gateway to extraordinary travel experiences around the world.
            </p>
            <Newsletter compact idPrefix="footer-newsletter" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Quick Links</h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Support</h2>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Contact Us</h2>
            <address className="mt-5 space-y-3 not-italic">
              <a
                href="mailto:hello@wanderlast.example"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
              >
                <Mail className="size-4 shrink-0" />
                hello@wanderlast.example
              </a>
              <a
                href="tel:+15550101234"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
              >
                <Phone className="size-4 shrink-0" />
                +1 555 010 1234
              </a>
              <p className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                123 Adventure Way, Example City
              </p>
            </address>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Follow Us</h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  icon: FacebookIcon,
                  hover: "hover:border-blue-500 hover:bg-blue-600",
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  icon: InstagramIcon,
                  hover:
                    "hover:border-pink-500 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400",
                },
                {
                  label: "X (Twitter)",
                  href: "https://x.com",
                  icon: XIcon,
                  hover: "hover:border-slate-400 hover:bg-slate-900",
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com",
                  icon: YouTubeIcon,
                  hover: "hover:border-red-500 hover:bg-red-600",
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                  icon: LinkedInIcon,
                  hover: "hover:border-sky-500 hover:bg-sky-700",
                },
              ].map(({ label, href, icon: Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition duration-300 hover:-translate-y-1 hover:text-white ${hover}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500 sm:text-left">
          © {currentYear} Wanderlast. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
