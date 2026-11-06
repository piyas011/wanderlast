"use client"

import { FormEvent, useState } from "react"

type NewsletterProps = {
  compact?: boolean
  idPrefix?: string
}

export default function Newsletter({
  compact = false,
  idPrefix = "newsletter",
}: NewsletterProps) {
  const [message, setMessage] = useState("")
  const inputId = `${idPrefix}-email`

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setMessage("Thank you for subscribing!")
    form.reset()
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <div className="flex overflow-hidden rounded-md border border-white/15 bg-white/5">
          <input
            id={inputId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
          />
          <button
            type="submit"
            className="bg-cyan-600 px-4 text-sm font-bold text-white transition hover:bg-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none focus-visible:ring-inset"
          >
            Subscribe
          </button>
        </div>
        <p className="mt-2 min-h-5 text-xs text-cyan-300" aria-live="polite">
          {message}
        </p>
      </form>
    )
  }

  return (
    <section className="bg-cyan-50/70 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Subscribe to Our Newsletter
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Get travel inspiration, exclusive offers, and the latest destination
          updates.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email address"
              className="min-h-12 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            />
            <button
              type="submit"
              className="min-h-12 rounded-md bg-cyan-600 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-lg focus-visible:ring-4 focus-visible:ring-cyan-200 focus-visible:outline-none"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-3 min-h-5 text-sm text-cyan-700" aria-live="polite">
            {message}
          </p>
        </form>
      </div>
    </section>
  )
}
