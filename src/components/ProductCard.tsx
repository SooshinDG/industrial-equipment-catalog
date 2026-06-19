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
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-brand-200 bg-white transition-colors hover:border-brand-400">
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        {/* 비주얼: 정보보다 작게 — 기술 도면 톤 썸네일 */}
        <div className="relative border-b border-brand-200">
          <CategoryVisual category={product.category} className="h-28 w-full" />
          {product.featured && (
            <div className="absolute left-2.5 top-2.5">
              <FeaturedBadge />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          {/* 분류 + 재고 */}
          <div className="flex items-center justify-between gap-2">
            <span className="eyebrow">{product.category}</span>
            <StockBadge status={product.stockStatus} />
          </div>

          {/* 제품명 (최우선) — 2줄 고정으로 카드 간 사양 시작선 정렬 */}
          <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-brand-900">
            {product.productName}
          </h3>
          {/* 제조사 · 모델 코드(mono) */}
          <p className="mt-1 text-xs text-brand-500">
            {product.manufacturer} ·{" "}
            <span className="num text-brand-600">{product.model}</span>
          </p>

          {/* 핵심 사양 — 괘선 정렬 데이터시트 */}
          {specs.length > 0 && (
            <dl className="mt-3 border-y border-brand-100">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-baseline justify-between gap-3 border-b border-brand-100 py-1.5 last:border-b-0"
                >
                  <dt className="text-[11px] text-brand-400">{spec.label}</dt>
                  <dd className="num text-xs font-medium text-brand-800">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* 가격 + 납기 */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            <p className="num text-lg font-semibold text-brand-900">
              {formatKrw(product.priceKrw)}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-brand-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="num">{formatLeadTime(product.leadTimeDays)}</span>
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
