import Link from "next/link";
import { Clock } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatKrw, formatLeadTime } from "@/lib/format";
import { CategoryVisual } from "./CategoryVisual";
import { FeaturedBadge, StockBadge } from "./StockBadge";

export function ProductCard({ product }: { product: Product }) {
  const specs = [
    { label: product.mainSpecLabel, value: product.mainSpecValue },
    { label: product.subSpecLabel, value: product.subSpecValue },
  ].filter((s) => s.label && s.value);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-100 bg-white transition-colors hover:border-brand-200">
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        <div className="relative">
          <CategoryVisual category={product.category} className="h-36 w-full" />
          {product.featured && (
            <div className="absolute left-3 top-3">
              <FeaturedBadge />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-brand-400">
              {product.category}
            </span>
            <StockBadge status={product.stockStatus} />
          </div>

          <h3 className="mt-2 text-base font-semibold text-brand-800 group-hover:text-brand-900">
            {product.productName}
          </h3>
          <p className="mt-0.5 text-xs text-brand-400">
            {product.manufacturer} · {product.model}
          </p>

          {specs.length > 0 && (
            <dl className="mt-3 grid grid-cols-2 gap-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-md bg-brand-50 px-2.5 py-2"
                >
                  <dt className="text-[11px] text-brand-400">{spec.label}</dt>
                  <dd className="text-sm font-medium text-brand-700">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto pt-4">
            <p className="text-lg font-bold text-brand-900">
              {formatKrw(product.priceKrw)}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-brand-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatLeadTime(product.leadTimeDays)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
