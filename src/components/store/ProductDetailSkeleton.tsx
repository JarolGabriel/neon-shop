export function ProductDetailSkeleton() {
  return (
    <section className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 h-3 w-48 rounded bg-muted" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="aspect-square w-full rounded-2xl bg-muted" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="size-16 rounded-lg bg-muted sm:size-20" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-7 w-40 rounded bg-muted" />
          <div className="h-16 w-full rounded bg-muted" />

          <div className="flex flex-col gap-3">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-10 w-24 rounded-full bg-muted" />
              ))}
            </div>
          </div>

          <div className="flex gap-2.5">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="size-8 rounded-full bg-muted" />
            ))}
          </div>

          <div className="h-12 w-full rounded-full bg-muted" />
          <div className="h-12 w-full rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}
