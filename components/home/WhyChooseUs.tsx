import { Headset, Map, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Feature = {
  title: string
  description: string
  icon: LucideIcon
}

const features: Feature[] = [
  {
    title: "Safe & Secure",
    description:
      "Your safety and comfort are our top priorities. Travel with confidence and peace of mind.",
    icon: ShieldCheck,
  },
  {
    title: "Expert Guides",
    description:
      "Explore incredible places with experienced local guides who know every destination.",
    icon: Map,
  },
  {
    title: "24/7 Support",
    description:
      "Our dedicated support team is always available to help you throughout your journey.",
    icon: Headset,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-cyan-50/70 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Why Choose Wanderlast
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-xl border border-cyan-100/80 bg-white p-6 text-center shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_16px_40px_rgba(8,145,178,0.12)] sm:p-7"
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 transition duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
