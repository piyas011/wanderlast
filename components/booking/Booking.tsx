"use client"

import Image from "next/image"
import { useState, type FormEvent } from "react"
import { CalendarDays, Clock3, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

import type { Destination } from "@/components/destinations/DestinationCard"
import { formatDepartureDate } from "@/components/destinations/DestinationCard"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Booking({ destination }: { destination: Destination }) {
  const [open, setOpen] = useState(false)
  const [travellers, setTravellers] = useState("1")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const unitPrice = Number(destination.price)
  const totalPrice = Number.isFinite(unitPrice)
    ? unitPrice * Number(travellers || 1)
    : 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!destination._id || isSubmitting) return

    const travellerCount = Number(travellers)
    if (
      !Number.isInteger(travellerCount) ||
      travellerCount < 1 ||
      travellerCount > 10
    ) {
      toast.error("Choose between 1 and 10 travellers.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: destination._id,
          travellers: travellerCount,
          notes: notes.trim(),
        }),
      })
      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(result.message || "Unable to create booking.")
      }

      toast.success("Booking created successfully.")
      setOpen(false)
      setNotes("")
      setTravellers("1")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create booking."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            size="lg"
            className="mt-5 h-11 w-full rounded-md bg-cyan-600 text-sm font-bold text-white hover:bg-cyan-700 focus-visible:ring-cyan-200"
          />
        }
      >
        Book Now
      </AlertDialogTrigger>

      <AlertDialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[560px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Confirm booking
          </AlertDialogTitle>
          <AlertDialogDescription>
            Review your trip before creating the booking.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="relative h-44 bg-slate-100">
            {destination.imageUrl ? (
              <Image
                src={destination.imageUrl}
                alt={destination.destinationName}
                fill
                sizes="560px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-slate-950">
                {destination.destinationName}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="size-3.5 text-cyan-600" />
                {destination.country}
              </p>
            </div>
            <div className="space-y-1 text-xs text-slate-600 sm:text-right">
              <p className="flex items-center gap-1.5 sm:justify-end">
                <Clock3 className="size-3.5 text-cyan-600" />
                {destination.duration}
              </p>
              <p className="flex items-center gap-1.5 sm:justify-end">
                <CalendarDays className="size-3.5 text-cyan-600" />
                {formatDepartureDate(destination.departureDate)}
              </p>
            </div>
          </div>
        </div>

        <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="travellers">Travellers</Label>
              <Input
                id="travellers"
                name="travellers"
                type="number"
                min={1}
                max={10}
                value={travellers}
                onChange={(event) => setTravellers(event.target.value)}
                className="h-10 rounded-md"
                required
              />
            </div>
            <div className="rounded-md bg-slate-50 px-4 py-2">
              <p className="text-xs text-slate-500">Total price</p>
              <p className="mt-1 text-xl font-bold text-cyan-700">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="booking-notes">Additional notes (optional)</Label>
            <textarea
              id="booking-notes"
              name="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Accessibility, dietary, or other preferences"
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm transition outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            />
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            form="booking-form"
            disabled={isSubmitting || !destination._id}
            className="bg-cyan-600 text-white hover:bg-cyan-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
