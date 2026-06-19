import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

export default function ProductsLoading() {
  return (
    <div className="container-page py-8">
      <div className="h-4 w-40 animate-pulse rounded bg-brand-100" />
      <div className="mt-4 h-7 w-48 animate-pulse rounded bg-brand-100" />

      <div className="mt-6 h-11 w-full animate-pulse rounded-md bg-brand-100" />

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="h-96 animate-pulse rounded-lg bg-brand-50" />
        </div>
        <div className="flex-1">
          <div className="h-4 w-28 animate-pulse rounded bg-brand-100" />
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
