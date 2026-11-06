"use client"

import { FormEvent, useRef, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function AddDestinationForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5000/add-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result: { acknowledged?: boolean; insertedId?: string } =
        await response.json()

      if (!response.ok || result.acknowledged !== true || !result.insertedId) {
        throw new Error("Destination was not saved")
      }

      form.reset()
      toast.success("Destination added successfully!", {
        duration: 3500,
      })
    } catch {
      toast.error("Failed to add destination. Please try again.", {
        duration: 3500,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-start justify-center px-4 py-7 sm:items-center sm:px-6 sm:py-10">
      <div className="w-full max-w-110">
        <h1 className="mb-5 text-[22px] leading-tight font-semibold tracking-tight text-slate-700 sm:text-[24px]">
          Add New Travel Package
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
                    defaultValue="Indonesia"
                    className="h-8 w-full rounded-[3px] border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="Indonesia">Indonesia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Bangladesh">Bangladesh</option>
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
                    defaultValue="Beach"
                    className="h-8 w-full rounded-[3px] border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="City">City</option>
                    <option value="Adventure">Adventure</option>
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
                  required
                  placeholder="https://example.com/image.jpg"
                  className="h-8 w-full rounded-[3px] border border-slate-200 px-3 text-[11px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
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
                    formRef.current?.reset()
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
                  {isSubmitting ? "Adding..." : "Add Travel Package"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
