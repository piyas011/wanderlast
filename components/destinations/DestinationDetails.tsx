"use client"

import Link from "next/link"
import HighQualityImage from "@/components/ui/high-quality-image"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  Loader2,
  MapPin,
  Star,
  Tag,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Destination } from "./DestinationCard"
import { formatDepartureDate } from "./DestinationCard"

export default function DestinationDetails({
  destination,
}: {
  destination: Destination
}) {
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!destination._id || isDeleting) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `http://localhost:5000/destination/${destination._id}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        throw new Error("Failed to delete destination")
      }

      const result: { acknowledged?: boolean; deletedCount?: number } =
        await response.json()

      if (result.acknowledged !== true || result.deletedCount !== 1) {
        throw new Error("Destination was not deleted")
      }

      setDeleteOpen(false)
      toast.success("Destination deleted successfully!", { duration: 3500 })
      router.push("/destinations")
      router.refresh()
    } catch {
      toast.error("Failed to delete destination. Please try again.", {
        duration: 3500,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const highlights =
    typeof destination.highlights === "string"
      ? destination.highlights
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      : (destination.highlights?.filter((item) => item.trim()) ?? [])

  const rating =
    destination.rating === undefined || destination.rating === ""
      ? null
      : String(destination.rating)

  return (
    <section className="bg-slate-50 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-360">
        <div className="mb-4 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <Link
            href="/destinations"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-cyan-500 hover:text-cyan-700"
          >
            <ArrowLeft className="size-4" />
            Back to Destinations
          </Link>
          {destination._id && (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <Link
                href={`/add-destinations?edit=${destination._id}`}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-cyan-500 hover:text-cyan-700"
              >
                <Edit3 className="size-4 text-cyan-600" />
                Edit Destination
              </Link>

              <AlertDialog
                open={deleteOpen}
                onOpenChange={(open) => {
                  if (!isDeleting) setDeleteOpen(open)
                }}
              >
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive" size="lg">
                      <Trash2 />
                      Delete
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                      <TriangleAlert />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Destination?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this destination? This
                      action cannot be undone. All associated destination
                      information will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      size="lg"
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 />
                          Yes, Delete
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.09)]">
          <div className="p-2.5 sm:p-3">
            <div className="relative h-64 overflow-hidden rounded-lg bg-slate-200 sm:h-96 lg:h-107.5">
              <HighQualityImage
                src={destination.imageUrl}
                alt={destination.destinationName}
                className="size-full object-cover"
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, calc(100vw - 360px)"
              />
            </div>
          </div>

          <div className="grid gap-7 px-5 pb-8 sm:px-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-9">
            <div className="min-w-0">
              <div className="pt-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-cyan-700">
                    <MapPin className="size-4" />
                    {destination.destinationName}
                    {destination.country ? `, ${destination.country}` : ""}
                  </div>
                  {rating && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                      <Star className="size-3.5 fill-current" />
                      {rating}
                    </div>
                  )}
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {destination.destinationName}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="size-4 text-cyan-600" />
                    {destination.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-cyan-600" />
                    {destination.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4 text-cyan-600" />
                    {formatDepartureDate(destination.departureDate)}
                  </span>
                </div>
              </div>

              <section className="mt-8 border-t border-slate-100 pt-5">
                <h2 className="text-lg font-bold text-slate-900">Overview</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                  {destination.description}
                </p>
              </section>

              {highlights.length > 0 && (
                <section className="mt-7">
                  <h2 className="text-lg font-bold text-slate-900">
                    Highlights
                  </h2>
                  <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {highlights.map((highlight, index) => (
                      <div
                        key={`${highlight}-${index}`}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
                          <Check className="size-3.5" />
                        </span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="lg:border-l lg:border-slate-100 lg:pl-7">
              <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <p className="text-xs font-semibold text-slate-500">
                  Starting Price
                </p>
                <p className="mt-1 text-3xl font-extrabold text-cyan-700">
                  ${destination.price}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="size-4 text-cyan-600" />
                    <span>
                      {formatDepartureDate(destination.departureDate)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 h-11 w-full rounded-md bg-cyan-600 text-sm font-bold text-white transition hover:bg-cyan-700 focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:outline-none"
                >
                  Book Now
                </button>

                <div className="mt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-cyan-600" />
                    Instant booking confirmation
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-cyan-600" />
                    Secure payment
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-cyan-600" />
                    {destination.duration}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
