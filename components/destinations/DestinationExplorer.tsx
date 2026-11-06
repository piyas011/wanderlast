"use client"

import { useMemo, useState } from "react"
import DestinationCard, { type Destination } from "./DestinationCard"

type DestinationExplorerProps = {
  destinations: Destination[]
  initialLocation?: string
  initialBudget?: string
  initialDuration?: string
}

type SortOption = "default" | "price-low" | "price-high" | "departure"

export default function DestinationExplorer({
  destinations,
  initialLocation = "",
  initialBudget = "any",
  initialDuration = "any",
}: DestinationExplorerProps) {
  const [category, setCategory] = useState("all")
  const [priceRange, setPriceRange] = useState(
    initialBudget === "any" ? "all" : initialBudget
  )
  const [sortBy, setSortBy] = useState<SortOption>("default")

  const categories = useMemo(
    () =>
      Array.from(new Set(destinations.map((item) => item.category))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [destinations]
  )

  const filteredDestinations = useMemo(() => {
    const location = initialLocation.trim().toLowerCase()
    const durationFilter = initialDuration === "any" ? null : initialDuration

    const filtered = destinations.filter((destination) => {
      const price = Number(destination.price)
      const matchesLocation =
        !location ||
        destination.destinationName.toLowerCase().includes(location) ||
        destination.country.toLowerCase().includes(location)
      const matchesCategory =
        category === "all" || destination.category === category

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-1000" && price < 1000) ||
        (priceRange === "1000-2000" && price >= 1000 && price <= 2000) ||
        (priceRange === "over-2000" && price > 2000) ||
        (priceRange === "0-10000" && price >= 0 && price <= 10000) ||
        (priceRange === "10000-30000" && price >= 10000 && price <= 30000) ||
        (priceRange === "30000+" && price >= 30000)

      let matchesDuration = true
      if (durationFilter) {
        const match = destination.duration.match(/\d+/)
        const dayCount = match ? Number(match[0]) : 0
        matchesDuration =
          (durationFilter === "1-3" && dayCount >= 1 && dayCount <= 3) ||
          (durationFilter === "4-7" && dayCount >= 4 && dayCount <= 7) ||
          (durationFilter === "7+" && dayCount >= 7)
      }

      return (
        matchesLocation && matchesCategory && matchesPrice && matchesDuration
      )
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price)
      }
      if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price)
      }
      if (sortBy === "departure") {
        return (
          new Date(a.departureDate).getTime() -
          new Date(b.departureDate).getTime()
        )
      }
      return 0
    })
  }, [
    category,
    destinations,
    initialDuration,
    initialLocation,
    priceRange,
    sortBy,
  ])

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
          Explore All Destinations
        </h1>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Price Range
            </span>
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Prices</option>
              <option value="under-1000">Under $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="over-2000">Over $2,000</option>
              <option value="0-10000">$0 - $10,000</option>
              <option value="10000-30000">$10,000 - $30,000</option>
              <option value="30000+">$30,000+</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
              Sort By
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="default">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="departure">Departure Date</option>
            </select>
          </label>
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard
                key={destination._id ?? `destination-${index}`}
                destination={destination}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-slate-600">
            No destinations match the selected filters.
          </div>
        )}
      </div>
    </section>
  )
}
