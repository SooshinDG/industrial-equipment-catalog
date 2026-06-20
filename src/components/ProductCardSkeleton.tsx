export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-brand-200 bg-white">
      <div className="h-28 w-full animate-pulse border-b border-brand-200 bg-brand-100" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-1/3 animate-pulse rounded-sm bg-brand-100" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-brand-100" />
        </div>
        <div className="h-4 w-3/4 animate-pulse rounded-sm bg-brand-100" />
        <div className="space-y-2 border-y border-brand-100 py-2">
          <div className="h-3 w-full animate-pulse rounded-sm bg-brand-50" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-brand-50" />
        </div>
        <div className="h-6 w-1/2 animate-pulse rounded-sm bg-brand-100" />
      </div>
    </div>
  );
}
