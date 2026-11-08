import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { database } from "@/lib/mongodb"

const requiredTextFields = [
  "destinationName",
  "country",
  "category",
  "price",
  "duration",
  "departureDate",
  "description",
  "imageUrl",
] as const

export async function GET() {
  const destinations = await database
    .collection("destinations")
    .find({})
    .sort({ _id: -1 })
    .toArray()

  return NextResponse.json(
    destinations.map((destination) => ({
      ...destination,
      _id: destination._id.toHexString(),
    }))
  )
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 })
  }

  for (const field of requiredTextFields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json(
        { message: `${field} is required.` },
        { status: 400 }
      )
    }
  }

  const price = Number(body.price)
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { message: "Price must be a positive number." },
      { status: 400 }
    )
  }

  try {
    const imageUrl = new URL(String(body.imageUrl))
    if (!["http:", "https:"].includes(imageUrl.protocol)) throw new Error()
  } catch {
    return NextResponse.json(
      { message: "Image URL must use HTTP or HTTPS." },
      { status: 400 }
    )
  }

  const destination = {
    destinationName: String(body.destinationName).trim(),
    country: String(body.country).trim(),
    category: String(body.category).trim(),
    price: String(price),
    duration: String(body.duration).trim(),
    departureDate: String(body.departureDate).trim(),
    imageUrl: String(body.imageUrl).trim(),
    description: String(body.description).trim(),
    rating: body.rating === undefined ? "" : String(body.rating),
    highlights: Array.isArray(body.highlights)
      ? body.highlights.map(String).filter(Boolean)
      : typeof body.highlights === "string"
        ? body.highlights
        : "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await database
    .collection("destinations")
    .insertOne(destination)

  return NextResponse.json(
    {
      acknowledged: true,
      insertedId: result.insertedId.toHexString(),
    },
    { status: 201 }
  )
}
