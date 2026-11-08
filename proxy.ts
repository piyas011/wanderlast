import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/signIn",
  "/signUp",
  "/api/auth",
]

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/signIn") {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
  if (pathname === "/signUp") {
    return NextResponse.redirect(new URL("/sign-up", request.url))
  }

  let session
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    })
  } catch {
    session = null
  }

  const isAuthenticated = Boolean(session?.user)

  if (isPublicPath(pathname)) {
    if (
      isAuthenticated &&
      (pathname === "/sign-in" || pathname === "/sign-up")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
