import AddDestinationForm from "@/components/admin/AddDestinationForm"
import type { Destination } from "@/components/destinations/DestinationCard"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import { database } from "@/lib/mongodb"

type AddDestinationsPageProps = {
  searchParams: Promise<{ edit?: string }>
}

export default async function AddDestinationsPage({
  searchParams,
}: AddDestinationsPageProps) {
  const { edit } = await searchParams
  let destination: Destination | undefined

  if (edit) {
    if (!ObjectId.isValid(edit)) {
      notFound()
    }
    try {
      const record = await database.collection("destinations").findOne({
        _id: new ObjectId(edit),
      })
      if (record) {
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
      destination = undefined
    }
  }

  return (
    <div className="flex-1 bg-[#edf0f2]">
      <AddDestinationForm destination={destination} editId={edit} />
    </div>
  )
}
