import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="container-page py-8">
      <div className="h-4 w-40 animate-pulse rounded-sm bg-brand-100" />
      <div className="mt-4 h-7 w-48 animate-pulse rounded-sm bg-brand-100" />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="h-6 w-24 animate-pulse rounded-sm bg-brand-100" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2 border-t border-brand-200 pt-4">
                <div className="h-3 w-20 animate-pulse rounded-sm bg-brand-100" />
                <div className="h-8 w-full animate-pulse rounded-sm bg-brand-50" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="h-11 w-full max-w-md animate-pulse rounded-md bg-brand-100 sm:max-w-md" />
          <div className="mt-5 h-8 w-32 animate-pulse rounded-sm bg-brand-100" />
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
