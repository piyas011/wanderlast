export default function DestinationLoading() {
  return (
    <section className="bg-slate-50 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-10 w-40 rounded-md bg-slate-200" />
        <div className="mt-7 h-72 rounded-xl bg-slate-200 sm:h-96" />
        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="h-9 w-72 max-w-full rounded-md bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
          </div>
          <div className="h-64 rounded-xl bg-slate-200" />
        </div>
      </div>
    </section>
  )
}
