import { Josefin_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/home/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/sonner"

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${josefinSans.variable} font-sans antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex flex-1 flex-col pt-16">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            duration={3500}
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
