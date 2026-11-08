import DestinationExplorer from "@/components/destinations/DestinationExplorer"
import type { Destination } from "@/components/destinations/DestinationCard"
import { database } from "@/lib/mongodb"

type DestinationsPageProps = {
  searchParams: Promise<{
    location?: string
    budget?: string
    duration?: string
  }>
}

export default async function AllDestinationsPage({
  searchParams,
}: DestinationsPageProps) {
  const params = await searchParams
  let destinations: Destination[] = []
  let loadFailed = false

  try {
    const records = await database
      .collection("destinations")
      .find({})
      .sort({ _id: -1 })
      .toArray()
    destinations = records.map((record) => ({
      ...record,
      _id: record._id.toHexString(),
      price: String(record.price ?? ""),
      rating:
        record.rating === undefined || record.rating === null
          ? undefined
          : String(record.rating),
    })) as Destination[]
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return (
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Explore All Destinations
          </h1>
          <p className="mt-4 text-slate-600">
            Destinations could not be loaded. Please try again.
          </p>
        </div>
      </section>
    )
  }

  return (
    <DestinationExplorer
      destinations={destinations}
      initialLocation={params.location}
      initialBudget={params.budget}
      initialDuration={params.duration}
    />
  )
}
