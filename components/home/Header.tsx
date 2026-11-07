import Link from "next/link"
import HighQualityImage from "@/components/ui/high-quality-image"
import {
  MapPin,
  CalendarDays,
  Wallet,
  Users,
  Search,
  ArrowRight,
} from "lucide-react"

export default function Header() {
  return (
    <header className="relative min-h-162.5 overflow-hidden bg-slate-900 text-white">
      {/* Background Image */}
      <HighQualityImage
        src="/assets/Banner.png"
        alt=""
        priority
        quality={95}
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-147.5 max-w-[1600px] flex-col px-3 sm:px-5">
        <section className="flex flex-1 flex-col items-center justify-center px-3 py-16 text-center lg:py-20">
          {/* Heading */}
          <h1 className="max-w-4xl text-4xl leading-[1.15] font-medium tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Your
            <br />
            <span className="font-bold">Next Adventure</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
            Explore breathtaking destinations and create unforgettable memories
            with our curated travel experiences.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/destinations"
              className="group flex items-center gap-3 bg-cyan-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-700"
            >
              EXPLORE NOW
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/destinations"
              className="border border-white/60 bg-white/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-gray-900"
            >
              VIEW DESTINATIONS
            </Link>
          </div>
        </section>

        {/* Travel Search Form */}
        <form
          action="/destinations"
          method="GET"
          className="grid grid-cols-1 gap-px bg-white/20 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1.3fr_1.3fr_1.2fr_1.1fr_140px]"
        >
          {/* Location */}
          <div className="flex items-center gap-3 bg-black/40 px-5 py-4 transition hover:bg-black/55">
            <MapPin className="shrink-0 text-cyan-400" size={22} />

            <div className="min-w-0 flex-1">
              <label
                htmlFor="location"
                className="mb-1 block text-sm font-bold text-white"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Address, City or Zip"
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/60"
              />
            </div>
          </div>

          {/* Date / Duration */}
          <div className="flex items-center gap-3 bg-black/40 px-5 py-4 transition hover:bg-black/55">
            <CalendarDays className="shrink-0 text-cyan-400" size={22} />

            <div className="min-w-0 flex-1">
              <label
                htmlFor="duration"
                className="mb-1 block text-sm font-bold text-white"
              >
                Date/Duration
              </label>

              <select
                id="duration"
                name="duration"
                defaultValue="any"
                className="w-full cursor-pointer bg-transparent text-xs text-white outline-none"
              >
                <option value="any" className="text-gray-900">
                  Anytime / 3 Days
                </option>
                <option value="1-3" className="text-gray-900">
                  1 - 3 Days
                </option>
                <option value="4-7" className="text-gray-900">
                  4 - 7 Days
                </option>
                <option value="7+" className="text-gray-900">
                  7+ Days
                </option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-3 bg-black/40 px-5 py-4 transition hover:bg-black/55">
            <Wallet className="shrink-0 text-cyan-400" size={22} />

            <div className="min-w-0 flex-1">
              <label
                htmlFor="budget"
                className="mb-1 block text-sm font-bold text-white"
              >
                Budget
              </label>

              <select
                id="budget"
                name="budget"
                defaultValue="any"
                className="w-full cursor-pointer bg-transparent text-xs text-white outline-none"
              >
                <option value="any" className="text-gray-900">
                  Any Budget
                </option>
                <option value="0-10000" className="text-gray-900">
                  ৳0 - ৳10,000
                </option>
                <option value="10000-30000" className="text-gray-900">
                  ৳10,000 - ৳30,000
                </option>
                <option value="30000+" className="text-gray-900">
                  ৳30,000+
                </option>
              </select>
            </div>
          </div>

          {/* People */}
          <div className="flex items-center gap-3 bg-black/40 px-5 py-4 transition hover:bg-black/55">
            <Users className="shrink-0 text-cyan-400" size={22} />

            <div className="min-w-0 flex-1">
              <label
                htmlFor="people"
                className="mb-1 block text-sm font-bold text-white"
              >
                People
              </label>

              <select
                id="people"
                name="people"
                defaultValue="2"
                className="w-full cursor-pointer bg-transparent text-xs text-white outline-none"
              >
                <option value="1" className="text-gray-900">
                  1 Person
                </option>
                <option value="2" className="text-gray-900">
                  2 People
                </option>
                <option value="3-5" className="text-gray-900">
                  3 - 5 People
                </option>
                <option value="5+" className="text-gray-900">
                  5+ People
                </option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex min-h-14 items-center justify-center gap-2 bg-cyan-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-cyan-700"
          >
            <Search size={19} />
            Search
          </button>
        </form>
      </div>
    </header>
  )
}
