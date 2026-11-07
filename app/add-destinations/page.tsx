import AddDestinationForm from "@/components/admin/AddDestinationForm"
import type { Destination } from "@/components/destinations/DestinationCard"

type AddDestinationsPageProps = {
  searchParams: Promise<{ edit?: string }>
}

export default async function AddDestinationsPage({
  searchParams,
}: AddDestinationsPageProps) {
  const { edit } = await searchParams
  let destination: Destination | undefined

  if (edit) {
    try {
      const response = await fetch(
        `http://localhost:5000/destination/${edit}`,
        {
          cache: "no-store",
        }
      )
      if (response.ok) {
        destination = (await response.json()) as Destination
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
