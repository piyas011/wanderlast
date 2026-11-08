import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"
import { randomUUID } from "node:crypto"

import { auth } from "@/lib/auth"
import { database } from "@/lib/mongodb"

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed"

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const bookings = await database
    .collection("bookings")
    .find({ userId: session.user.id })
    .sort({ bookingDate: -1 })
    .toArray()

  return NextResponse.json({
    bookings: bookings.map((booking) => ({
      ...booking,
      _id: booking._id.toHexString(),
      destinationId:
        booking.destinationId instanceof ObjectId
          ? booking.destinationId.toHexString()
          : String(booking.destinationId),
      bookingDate:
        booking.bookingDate instanceof Date
          ? booking.bookingDate.toISOString()
          : String(booking.bookingDate ?? ""),
      cancelledAt:
        booking.cancelledAt instanceof Date
          ? booking.cancelledAt.toISOString()
          : booking.cancelledAt
            ? String(booking.cancelledAt)
            : undefined,
      createdAt:
        booking.createdAt instanceof Date
          ? booking.createdAt.toISOString()
          : booking.createdAt
            ? String(booking.createdAt)
            : undefined,
      updatedAt:
        booking.updatedAt instanceof Date
          ? booking.updatedAt.toISOString()
          : booking.updatedAt
            ? String(booking.updatedAt)
            : undefined,
    })),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: {
    destinationId?: unknown
    travellers?: unknown
    notes?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 })
  }

  if (
    typeof body.destinationId !== "string" ||
    !ObjectId.isValid(body.destinationId)
  ) {
    return NextResponse.json(
      { message: "A valid destination is required." },
      { status: 400 }
    )
  }

  const travellers = Number(body.travellers)
  if (!Number.isInteger(travellers) || travellers < 1 || travellers > 10) {
    return NextResponse.json(
      { message: "Choose between 1 and 10 travellers." },
      { status: 400 }
    )
  }

  const notes =
    typeof body.notes === "string" ? body.notes.trim().slice(0, 500) : ""

  const destinations = database.collection("destinations")
  const destination = await destinations.findOne({
    _id: new ObjectId(body.destinationId),
  })

  if (!destination) {
    return NextResponse.json(
      { message: "Destination not found." },
      { status: 404 }
    )
  }

  const unitPrice = Number(destination.price)
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    return NextResponse.json(
      { message: "This destination does not have a valid price." },
      { status: 422 }
    )
  }

  const bookings = database.collection("bookings")
  const activeBooking = await bookings.findOne({
    userId: session.user.id,
    destinationId: new ObjectId(body.destinationId),
    status: { $in: ["Pending", "Confirmed"] },
  })

  if (activeBooking) {
    return NextResponse.json(
      { message: "You already have an active booking for this destination." },
      { status: 409 }
    )
  }

  const bookingStatus: BookingStatus = "Pending"
  const now = new Date()
  const booking = {
    userId: session.user.id,
    destinationId: new ObjectId(body.destinationId),
    destinationSnapshot: {
      destinationName: String(destination.destinationName ?? ""),
      country: String(destination.country ?? ""),
      imageUrl: String(destination.imageUrl ?? ""),
      duration: String(destination.duration ?? ""),
      departureDate: String(destination.departureDate ?? ""),
    },
    travellers,
    notes,
    unitPrice,
    totalPrice: unitPrice * travellers,
    status: bookingStatus,
    bookingReference: `WL-${now.getTime().toString(36).slice(-7).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`,
    bookingDate: now,
    createdAt: now,
    updatedAt: now,
  }

  const result = await bookings.insertOne(booking)

  return NextResponse.json(
    {
      booking: {
        ...booking,
        _id: result.insertedId.toHexString(),
        destinationId: body.destinationId,
        bookingDate: booking.bookingDate.toISOString(),
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      },
    },
    { status: 201 }
  )
}
