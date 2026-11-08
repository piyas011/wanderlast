"use client"
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useRef, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Destination } from "@/components/destinations/DestinationCard"

export default function AddDestinationForm({
  destination,
  editId,
}: {
  destination?: Destination
  editId?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    destination?.imageUrl ?? ""
  )
  const router = useRouter()
  const isEditing = Boolean(editId && destination)
  const countries = ["Indonesia", "Thailand", "Malaysia", "Bangladesh"]
  const categories = ["Beach", "Mountain", "City", "Adventure"]
  const destinationCountry =
    destination?.country && !countries.includes(destination.country)
      ? [destination.country, ...countries]
      : countries
  const destinationCategory =
    destination?.category && !categories.includes(destination.category)
      ? [destination.category, ...categories]
      : categories

  if (editId && !destination) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Destination not found
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            The destination you are trying to edit could not be loaded.
          </p>
          <button
            type="button"
            onClick={() => router.push("/destinations")}
            className="mt-5 h-9 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
          >
            Back to Destinations
          </button>
        </div>
      </section>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const submittedImageUrl =
      typeof data.imageUrl === "string" ? data.imageUrl.trim() : ""

    if (submittedImageUrl) {
      try {
        const imageUrl = new URL(submittedImageUrl)
        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          throw new Error("Invalid image URL")
        }
      } catch {
        toast.error("Please enter a valid HTTP or HTTPS image URL.", {
          duration: 3500,
        })
        return
      }
    }

    if (
      isEditing &&
      (!submittedImageUrl || submittedImageUrl === destination?.imageUrl)
    ) {
      delete data.imageUrl
    } else if (submittedImageUrl) {
      data.imageUrl = submittedImageUrl
    } else {
      delete data.imageUrl
    }
    setIsSubmitting(true)

    try {
      const response = await fetch(
        isEditing ? `/api/destinations/${editId}` : "/api/destinations",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      const result: {
        acknowledged?: boolean
        insertedId?: string
        modifiedCount?: number
      } = await response.json()

      if (
        !response.ok ||
        result.acknowledged !== true ||
        (!isEditing && !result.insertedId)
      ) {
        throw new Error("Destination was not saved")
      }

      if (!isEditing) form.reset()
      toast.success(
        isEditing
          ? "Destination updated successfully!"
          : "Destination added successfully!",
        {
          duration: 3500,
        }
      )
      if (isEditing) router.push(`/destinations/${editId}`)
      router.refresh()
    } catch {
      toast.error(
        isEditing
          ? "Failed to update destination. Please try again."
          : "Failed to add destination. Please try again.",
        {
          duration: 3500,
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-7 sm:items-center sm:px-6 sm:py-10">
      <div className="w-full max-w-110">
        <h1 className="mb-5 text-[22px] leading-tight font-semibold tracking-tight text-slate-700 sm:text-[24px]">
          {isEditing ? "Edit Travel Package" : "Add New Travel Package"}
        </h1>

        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="space-y-4 px-7 py-5 sm:px-7.5">
              <div>
                <label
                  htmlFor="destination-name"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                >
                  Destination Name
                </label>
                <input
                  id="destination-name"
                  name="destinationName"
                  type="text"
                  required
                  defaultValue={destination?.destinationName ?? ""}
                  placeholder="Bali Paradise"
                  className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_0.78fr]">
                <div>
                  <label
                    htmlFor="country"
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    required
                    defaultValue={destination?.country ?? "Indonesia"}
                    className="h-8 w-full rounded-[3px] border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    {destinationCountry.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    defaultValue={destination?.category ?? "Beach"}
                    className="h-8 w-full rounded-[3px] border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    {destinationCategory.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                  >
                    Price (USD)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    required
                    defaultValue={destination?.price ?? ""}
                    placeholder="e.g., 1299"
                    className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                  >
                    Duration
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    required
                    defaultValue={destination?.duration ?? ""}
                    placeholder="e.g., 7 Days / 6 Nights"
                    className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="departure-date"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                >
                  Departure Date
                </label>
                <input
                  id="departure-date"
                  name="departureDate"
                  type="date"
                  required
                  defaultValue={destination?.departureDate?.slice(0, 10) ?? ""}
                  className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label
                  htmlFor="image-url"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                >
                  Image URL
                </label>
                <input
                  id="image-url"
                  name="imageUrl"
                  type="url"
                  required={!isEditing}
                  defaultValue={destination?.imageUrl ?? ""}
                  onChange={(event) =>
                    setImagePreviewUrl(event.target.value.trim())
                  }
                  placeholder="https://example.com/image.jpg"
                  className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                {imagePreviewUrl && (
                  <div className="mt-2 aspect-[16/9] overflow-hidden rounded-[3px] border border-slate-200 bg-slate-100">
                    <img
                      src={imagePreviewUrl}
                      alt="Destination image preview"
                      className="size-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-[11px] font-semibold text-slate-600"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  defaultValue={destination?.description ?? ""}
                  placeholder="Describe the travel experience..."
                  className="w-full resize-y rounded-[3px] border border-slate-200 px-3 py-2 text-[11px] leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 px-7 py-3 sm:px-7.5">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (isEditing && editId) {
                      router.push(`/destinations/${editId}`)
                    } else {
                      formRef.current?.reset()
                    }
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-red-300 px-2.5 text-[10px] font-semibold text-red-500 transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 aria-hidden="true" className="size-3" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-8 min-w-31 items-center justify-center gap-1.5 rounded-[3px] border border-cyan-600 bg-cyan-500 px-2.5 text-[10px] font-semibold text-white transition hover:bg-cyan-600 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2
                      aria-hidden="true"
                      className="size-3 animate-spin"
                    />
                  ) : (
                    <Plus aria-hidden="true" className="size-3" />
                  )}
                  {isEditing
                    ? isSubmitting
                      ? "Updating..."
                      : "Update Travel Package"
                    : isSubmitting
                      ? "Adding..."
                      : "Add Travel Package"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
