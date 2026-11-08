"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  CalendarDays,
  Clock3,
  Loader2,
  MapPin,
  TicketCheck,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type Booking = {
  _id: string
  destinationId: string
  destinationSnapshot: {
    destinationName: string
    country: string
    imageUrl: string
    duration: string
    departureDate: string
  }
  travellers: number
  notes: string
  unitPrice: number
  totalPrice: number
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  bookingReference: string
  bookingDate: string
  cancelledAt?: string
}

const statusStyles: Record<Booking["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
}

function formatDate(value?: string) {
  if (!value) return "Not specified"
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
}

export default function MyBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"All" | Booking["status"]>("All")
  const [cancellingId, setCancellingId] = useState("")

  const loadBookings = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/bookings", { cache: "no-store" })
      const result = (await response.json()) as {
        bookings?: Booking[]
        message?: string
      }
      if (!response.ok)
        throw new Error(result.message || "Unable to load bookings.")
      setBookings(result.bookings ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load bookings."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadInitialBookings = async () => {
      try {
        const response = await fetch("/api/bookings", { cache: "no-store" })
        const result = (await response.json()) as {
          bookings?: Booking[]
          message?: string
        }
        if (!active) return
        if (!response.ok) {
          throw new Error(result.message || "Unable to load bookings.")
        }
        setBookings(result.bookings ?? [])
        setLoading(false)
      } catch (loadError) {
        if (!active) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load bookings."
        )
        setLoading(false)
      }
    }

    void loadInitialBookings()
    return () => {
      active = false
    }
  }, [])

  const cancelBooking = async (id: string) => {
    setCancellingId(id)
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok)
        throw new Error(result.message || "Unable to cancel booking.")
      toast.success("Booking cancelled successfully.")
      await loadBookings()
    } catch (cancelError) {
      toast.error(
        cancelError instanceof Error
          ? cancelError.message
          : "Unable to cancel booking."
      )
    } finally {
      setCancellingId("")
    }
  }

  const visibleBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filter)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-700">Your trips</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage your destination bookings.
          </p>
        </div>
        <Link
          href="/destinations"
          className="inline-flex h-10 items-center justify-center rounded-md bg-cyan-600 px-4 text-sm font-bold text-white hover:bg-cyan-700"
        >
          Browse Destinations
        </Link>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
        {(
          ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const
        ).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ring-1 transition ${
              filter === value
                ? "bg-slate-950 text-white ring-slate-950"
                : "bg-white text-slate-600 ring-slate-200 hover:text-cyan-700"
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white"
            >
              <div className="h-44 rounded-t-xl bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
                <div className="h-9 w-full rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadBookings}>
            Try Again
          </Button>
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-cyan-50 text-cyan-700">
            <TicketCheck className="size-6" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-950">
            No bookings found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Start planning your next trip and your bookings will appear here.
          </p>
          <Link
            href="/destinations"
            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-cyan-600 px-4 text-sm font-medium text-white hover:bg-cyan-700"
          >
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleBookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="relative h-44 bg-slate-100">
                {booking.destinationSnapshot.imageUrl ? (
                  <Image
                    src={booking.destinationSnapshot.imageUrl}
                    alt={booking.destinationSnapshot.destinationName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}
                <span
                  className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="p-5">
                <p className="flex items-center gap-1 text-xs font-semibold text-cyan-700">
                  <MapPin className="size-3.5" />
                  {booking.destinationSnapshot.country}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">
                  {booking.destinationSnapshot.destinationName}
                </h2>
                <div className="mt-4 space-y-2 border-y border-slate-100 py-3 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-cyan-600" />
                    Departure:{" "}
                    {formatDate(booking.destinationSnapshot.departureDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="size-4 text-cyan-600" />
                    {booking.destinationSnapshot.duration} ·{" "}
                    {booking.travellers} traveller
                    {booking.travellers === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total price</p>
                    <p className="text-xl font-bold text-cyan-700">
                      ${booking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button variant="outline" size="sm" type="button" />
                        }
                      >
                        Details
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Booking Details</AlertDialogTitle>
                          <AlertDialogDescription>
                            Reference {booking.bookingReference}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <dl className="grid gap-3 rounded-lg border border-slate-200 p-4 text-sm">
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Status</dt>
                            <dd className="font-bold">{booking.status}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Booked on</dt>
                            <dd className="text-right font-semibold">
                              {formatDate(booking.bookingDate)}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Travellers</dt>
                            <dd className="font-semibold">
                              {booking.travellers}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Total</dt>
                            <dd className="font-bold text-cyan-700">
                              ${booking.totalPrice.toLocaleString()}
                            </dd>
                          </div>
                          {booking.notes ? (
                            <div>
                              <dt className="text-slate-500">Notes</dt>
                              <dd className="mt-1">{booking.notes}</dd>
                            </div>
                          ) : null}
                        </dl>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {booking.status === "Pending" ? (
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              className="text-red-600 hover:text-red-700"
                            />
                          }
                        >
                          Cancel
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel this booking?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Your booking will be marked as cancelled and kept
                              in your history.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={cancellingId === booking._id}
                              onClick={() => void cancelBooking(booking._id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              {cancellingId === booking._id ? (
                                <>
                                  <Loader2 className="animate-spin" />
                                  Cancelling
                                </>
                              ) : (
                                "Cancel Booking"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
