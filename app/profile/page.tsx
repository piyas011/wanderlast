import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { database } from "@/lib/mongodb"
import ProfileClient from "./profile-client"

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/sign-in")
  }

  const bookings = await database
    .collection("bookings")
    .find({ userId: session.user.id })
    .toArray()

  const activeStatuses = ["Pending", "Confirmed"]
  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  )
  const upcomingBookings = bookings.filter((booking) =>
    activeStatuses.includes(String(booking.status))
  )
  const spentBookings = bookings.filter((booking) =>
    ["Confirmed", "Completed"].includes(String(booking.status))
  )

  return (
    <ProfileClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt.toISOString(),
      }}
      stats={{
        totalBookings: bookings.length,
        countriesVisited: new Set(
          completedBookings
            .map((booking) =>
              String(booking.destinationSnapshot?.country ?? "")
            )
            .filter(Boolean)
        ).size,
        upcomingTrips: upcomingBookings.length,
        totalSpent: spentBookings.reduce(
          (sum, booking) => sum + Number(booking.totalPrice || 0),
          0
        ),
      }}
    />
  )
}
