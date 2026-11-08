import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f7fafb] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] sm:p-8">
        <span className="grid size-11 place-items-center rounded-full bg-cyan-50 text-cyan-700">
          <Mail className="size-5" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          Reset your password
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Password reset email delivery is not configured in this application
          yet. Contact the site administrator to regain access.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </section>
    </div>
  )
}
