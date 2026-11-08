import DestinationDetails from "@/components/destinations/DestinationDetails"
import type { Destination } from "@/components/destinations/DestinationCard"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import { database } from "@/lib/mongodb"

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!ObjectId.isValid(id)) {
    notFound()
  }

  let destination: Destination | null = null
  let loadError = ""

  try {
    const record = await database.collection("destinations").findOne({
      _id: new ObjectId(id),
    })
    if (!record) {
      loadError = "not-found"
    } else {
      destination = {
        ...record,
        _id: record._id.toHexString(),
        price: String(record.price ?? ""),
        rating:
          record.rating === undefined || record.rating === null
            ? undefined
            : String(record.rating),
      } as Destination
    }
  } catch {
    loadError = "error"
  }

  if (loadError === "not-found") {
    return (
      <StateSection
        title="Destination not found"
        description="This destination may have been removed or the link is incorrect."
      />
    )
  }

  if (loadError || !destination) {
    return (
      <StateSection
        title="Unable to load destination"
        description="Please check your connection and try again."
        retry
      />
    )
  }

  return <DestinationDetails destination={destination} />
}

function StateSection({
  title,
  description,
  retry = false,
}: {
  title: string
  description: string
  retry?: boolean
}) {
  return (
    <section className="flex min-h-[calc(100vh-16rem)] items-center bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/destinations"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
          >
            <ArrowLeft className="size-4" />
            Back to Destinations
          </Link>
          {retry && (
            <Link
              href="."
              className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              <RotateCcw className="size-4" />
              Retry
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
