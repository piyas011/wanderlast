import { CalendarDays, Clock3, MapPin } from "lucide-react"
import HighQualityImage from "@/components/ui/high-quality-image"
import Booking from "@/components/booking/Booking"

export interface Destination {
  _id?: string
  destinationName: string
  country: string
  category: string
  price: string
  duration: string
  departureDate: string
  imageUrl: string
  description: string
  rating?: number | string
  highlights?: string[] | string
}

type DestinationCardProps = {
  destination: Destination
  index: number
}

export function formatDepartureDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export default function DestinationCard({
  destination,
  index,
}: DestinationCardProps) {
  const anchorId = destination._id
    ? `destination-${destination._id}`
    : `destination-${index}`

  return (
    <article
      id={anchorId}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(8,145,178,0.14)]"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <HighQualityImage
          src={destination.imageUrl}
          alt={destination.destinationName}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          quality={95}
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
          <MapPin aria-hidden="true" className="size-4" />
          <span>{destination.country}</span>
        </div>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          {destination.destinationName}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {destination.description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">Package price</p>
              <p className="mt-1 text-xl font-bold text-cyan-700">
                ${destination.price}
              </p>
            </div>

            <div className="space-y-1.5 text-right text-xs text-slate-600">
              <div className="flex items-center justify-end gap-1.5">
                <Clock3 aria-hidden="true" className="size-4 text-cyan-600" />
                <span>{destination.duration}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <CalendarDays
                  aria-hidden="true"
                  className="size-4 text-cyan-600"
                />
                <span>{formatDepartureDate(destination.departureDate)}</span>
              </div>
            </div>
          </div>

          {destination._id ? <Booking destination={destination} /> : null}
        </div>
      </div>
    </article>
  )
}
