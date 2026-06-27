/** Perceived-performance skeleton while the projects load. */
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-9 w-44 rounded-lg bg-elevated" />
          <div className="mt-3 h-4 w-80 max-w-[70vw] rounded bg-elevated/70" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-elevated" />
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="h-7 w-10 rounded bg-elevated" />
            <div className="mt-3 h-3 w-16 rounded bg-elevated/70" />
          </div>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-11 flex-1 rounded-xl bg-elevated/70" />
        <div className="h-11 w-36 rounded-xl bg-elevated/70" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden p-0">
            <div className="h-28 bg-elevated" />
            <div className="p-5">
              <div className="h-4 w-28 rounded bg-elevated" />
              <div className="mt-3 h-3 w-40 max-w-full rounded bg-elevated/70" />
              <div className="mt-6 h-3 w-full rounded bg-elevated/60" />
              <div className="mt-2 h-3 w-3/4 rounded bg-elevated/60" />
              <div className="mt-8 h-9 w-full rounded-xl bg-elevated/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
