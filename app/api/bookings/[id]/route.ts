import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"

import { auth } from "@/lib/auth"
import { database } from "@/lib/mongodb"

export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid booking reference." },
      { status: 400 }
    )
  }

  const bookings = database.collection("bookings")
  const booking = await bookings.findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!booking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 })
  }

  if (booking.status !== "Pending") {
    return NextResponse.json(
      { message: "Only pending bookings can be cancelled." },
      { status: 409 }
    )
  }

  await bookings.updateOne(
    { _id: booking._id, userId: session.user.id },
    {
      $set: {
        status: "Cancelled",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
    }
  )

  return NextResponse.json({ message: "Booking cancelled successfully." })
}
