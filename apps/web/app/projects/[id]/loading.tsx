/** Perceived-performance skeleton while a project detail loads. */
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-3 w-32 rounded bg-elevated/70" />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-9 w-64 max-w-[70vw] rounded-lg bg-elevated" />
          <div className="mt-3 h-4 w-48 rounded bg-elevated/70" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 rounded-xl bg-elevated/70" />
          <div className="h-10 w-10 rounded-xl bg-elevated/70" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="card overflow-hidden p-0">
            <div className="aspect-video w-full bg-elevated" />
          </div>
          <div className="card p-6">
            <div className="h-4 w-40 rounded bg-elevated" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-elevated/70" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-1/3 rounded bg-elevated/70" />
                    <div className="h-3 w-3/4 rounded bg-elevated/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="h-4 w-28 rounded bg-elevated" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-full rounded bg-elevated/60" />
              <div className="h-3 w-5/6 rounded bg-elevated/60" />
              <div className="h-3 w-2/3 rounded bg-elevated/60" />
            </div>
          </div>
          <div className="card p-6">
            <div className="h-4 w-24 rounded bg-elevated" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-elevated/60" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
