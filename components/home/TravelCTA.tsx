import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function TravelCTA() {
  return (
    <section className="relative isolate flex min-h-[360px] items-center overflow-hidden bg-slate-950 text-center text-white">
      <Image
        src="/assets/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-transparent to-cyan-950/20" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 text-sm text-white/80 sm:text-base">
          Join thousands of travelers who have discovered the world with us.
        </p>
        <Link
          href="/destinations"
          className="group mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-cyan-600 px-6 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-500 hover:shadow-[0_12px_30px_rgba(8,145,178,0.35)] focus-visible:ring-4 focus-visible:ring-cyan-300/60 focus-visible:outline-none"
        >
          Book Your Trip Today
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
