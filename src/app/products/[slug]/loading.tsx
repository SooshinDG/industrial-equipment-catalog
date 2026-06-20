export default function ProductDetailLoading() {
  return (
    <div className="container-page py-8">
      <div className="h-4 w-64 animate-pulse rounded-sm bg-brand-100" />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 정보 (우세) */}
        <div className="order-1 space-y-4 lg:order-2 lg:col-span-7">
          <div className="h-4 w-24 animate-pulse rounded-sm bg-brand-100" />
          <div className="h-8 w-3/4 animate-pulse rounded-sm bg-brand-100" />
          <div className="h-9 w-40 animate-pulse rounded-sm bg-brand-100" />
          <div className="h-20 w-full animate-pulse rounded-sm border border-brand-200 bg-brand-50" />
          <div className="h-11 w-56 animate-pulse rounded-md bg-brand-100" />
        </div>
        {/* 비주얼 (작게) */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="aspect-[16/9] w-full animate-pulse rounded-sm border border-brand-200 bg-brand-100 sm:aspect-[4/3]" />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="h-72 animate-pulse rounded-sm border border-brand-200 bg-brand-50 lg:col-span-2" />
        <div className="h-72 animate-pulse rounded-sm border border-brand-200 bg-brand-50" />
      </div>
    </div>
  );
}
