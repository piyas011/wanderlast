import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DestinationNotFound() {
  return (
    <section className="flex min-h-[calc(100vh-16rem)] items-center bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Destination not found
        </h1>
        <p className="mt-3 text-slate-600">
          This destination may have been removed or the link is incorrect.
        </p>
        <Link
          href="/destinations"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
        >
          <ArrowLeft className="size-4" />
          Back to Destinations
        </Link>
      </div>
    </section>
  )
}
