export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-brand-100 bg-white">
      <div className="h-36 w-full animate-pulse bg-brand-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-brand-100" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-100" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 animate-pulse rounded bg-brand-50" />
          <div className="h-12 animate-pulse rounded bg-brand-50" />
        </div>
        <div className="h-5 w-1/2 animate-pulse rounded bg-brand-100" />
      </div>
    </div>
  );
}
