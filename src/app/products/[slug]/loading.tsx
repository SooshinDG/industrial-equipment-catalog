export default function ProductDetailLoading() {
  return (
    <div className="container-page py-8">
      <div className="h-4 w-64 animate-pulse rounded bg-brand-100" />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-brand-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-100" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-brand-100" />
          <div className="h-9 w-40 animate-pulse rounded bg-brand-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-lg bg-brand-50" />
            <div className="h-16 animate-pulse rounded-lg bg-brand-50" />
          </div>
          <div className="h-11 w-48 animate-pulse rounded-md bg-brand-100" />
        </div>
      </div>

      <div className="mt-12 h-64 w-full animate-pulse rounded-lg bg-brand-50" />
    </div>
  );
}
