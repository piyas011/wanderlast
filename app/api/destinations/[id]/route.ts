import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"

import { auth } from "@/lib/auth"
import { database } from "@/lib/mongodb"

const allowedFields = [
  "destinationName",
  "country",
  "category",
  "price",
  "duration",
  "departureDate",
  "imageUrl",
  "description",
  "rating",
  "highlights",
] as const

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid destination ID." },
      { status: 400 }
    )
  }

  const destination = await database.collection("destinations").findOne({
    _id: new ObjectId(id),
  })

  if (!destination) {
    return NextResponse.json(
      { message: "Destination not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ...destination,
    _id: destination._id.toHexString(),
  })
}

export async function PUT(
  request: NextRequest,
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
      { message: "Invalid destination ID." },
      { status: 400 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 })
  }

  const updates = Object.fromEntries(
    allowedFields
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]])
  ) as Record<string, unknown>

  if (updates.imageUrl !== undefined) {
    if (typeof updates.imageUrl !== "string" || !updates.imageUrl.trim()) {
      delete updates.imageUrl
    } else {
      try {
        const imageUrl = new URL(updates.imageUrl)
        if (!["http:", "https:"].includes(imageUrl.protocol)) throw new Error()
      } catch {
        return NextResponse.json(
          { message: "Image URL must use HTTP or HTTPS." },
          { status: 400 }
        )
      }
      updates.imageUrl = updates.imageUrl.trim()
    }
  }

  if (updates.price !== undefined) {
    const price = Number(updates.price)
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { message: "Price must be a positive number." },
        { status: 400 }
      )
    }
    updates.price = String(price)
  }

  for (const field of [
    "destinationName",
    "country",
    "category",
    "duration",
    "departureDate",
    "description",
  ] as const) {
    if (
      updates[field] !== undefined &&
      (typeof updates[field] !== "string" || !updates[field].trim())
    ) {
      return NextResponse.json(
        { message: `${field} cannot be empty.` },
        { status: 400 }
      )
    }
    if (typeof updates[field] === "string") {
      updates[field] = updates[field].trim()
    }
  }

  updates.updatedAt = new Date()
  const result = await database
    .collection("destinations")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates })

  if (!result.matchedCount) {
    return NextResponse.json(
      { message: "Destination not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    acknowledged: result.acknowledged,
    modifiedCount: result.modifiedCount,
  })
}

export async function DELETE(
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
      { message: "Invalid destination ID." },
      { status: 400 }
    )
  }

  const result = await database.collection("destinations").deleteOne({
    _id: new ObjectId(id),
  })

  if (!result.deletedCount) {
    return NextResponse.json(
      { message: "Destination not found." },
      { status: 404 }
    )
  }

  return NextResponse.json({
    acknowledged: result.acknowledged,
    deletedCount: result.deletedCount,
  })
}
