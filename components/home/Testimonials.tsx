"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Testimonial = {
  name: string
  role: string
  quote: string
  image?: string
  initials?: string
  accent?: string
}

const testimonials: Testimonial[] = [
  {
    name: "Marcus Johnson",
    role: "Adventure traveler, London",
    quote:
      "Every detail was handled beautifully, from the transfers to the local guides. I felt completely free to enjoy the journey.",
    image: "/assets/person2.png",
  },
  {
    name: "Aisha Rahman",
    role: "Solo traveler, Dhaka",
    quote:
      "Wanderlast helped me discover places I would never have found alone. The experience felt personal, safe, and unforgettable.",
    image: "/assets/person1.png",
  },
  {
    name: "Daniel Kim",
    role: "Family traveler, Seoul",
    quote:
      "Our family trip was effortless and exciting. The itinerary balanced discovery, relaxation, and memorable moments for everyone.",
    initials: "DK",
    accent: "from-cyan-500 to-blue-600",
  },
]

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            What Travelers Say
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Real experiences from travelers who trusted us with their journeys.
          </p>
        </header>

        <Carousel
          className="mt-10"
          opts={{ align: "start", loop: true }}
          aria-label="Customer testimonials"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="pl-4 md:basis-1/2"
              >
                <article
                  key={testimonial.name}
                  className="grid min-h-52 grid-cols-[1fr_112px] overflow-hidden rounded-xl border border-slate-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.11)] sm:grid-cols-[1fr_150px]"
                >
                  <div className="flex flex-col p-5 sm:p-6">
                    <div
                      className="flex text-amber-400"
                      aria-label="5 out of 5 stars"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          aria-hidden="true"
                          className="size-3.5 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-sm leading-6 text-slate-600">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-auto pt-5">
                      <p className="text-sm font-bold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="relative min-h-full overflow-hidden bg-cyan-100">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={`Portrait of ${testimonial.name}`}
                        fill
                        sizes="(max-width: 768px) 112px, 150px"
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-full items-center justify-center bg-linear-to-br ${testimonial.accent} text-2xl font-bold text-white`}
                        aria-label={`Portrait placeholder for ${testimonial.name}`}
                      >
                        {testimonial.initials}
                      </div>
                    )}
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            aria-label="Previous testimonials"
            className="-left-2 size-11 border-cyan-100 bg-white text-cyan-700 shadow-md transition hover:border-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:ring-4 focus-visible:ring-cyan-200 sm:-left-4"
          />
          <CarouselNext
            aria-label="Next testimonials"
            className="-right-2 size-11 border-cyan-100 bg-white text-cyan-700 shadow-md transition hover:border-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 focus-visible:ring-4 focus-visible:ring-cyan-200 sm:-right-4"
          />
        </Carousel>
      </div>
    </section>
  )
}
