import Link from "next/link";
import { RotateCcw, X } from "lucide-react";
import {
  buildCatalogHref,
  getActiveChips,
  type CatalogQuery,
} from "@/lib/catalog";

export function FilterChips({ query }: { query: CatalogQuery }) {
  const chips = getActiveChips(query);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={`${chip.key}-${chip.value}`}
          href={buildCatalogHref(query, { [chip.key]: "", page: 1 })}
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-sm border border-brand-300 bg-white py-1 pl-2.5 pr-1.5 text-xs text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
        >
          <span>{chip.label}</span>
          <X className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
          <span className="sr-only">필터 해제</span>
        </Link>
      ))}
      {/* 전체 초기화 — 태그와 구분되지만 강한 CTA처럼 보이지 않게 */}
      <Link
        href="/products"
        scroll={false}
        className="inline-flex items-center gap-1 px-1 text-xs font-medium text-brand-500 underline-offset-2 hover:text-brand-800 hover:underline"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        전체 초기화
      </Link>
    </div>
  );
}
