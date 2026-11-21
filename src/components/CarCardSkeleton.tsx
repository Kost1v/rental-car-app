function CarCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="h-48 bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-100" />
        <div className="h-12 rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}

export default CarCardSkeleton
