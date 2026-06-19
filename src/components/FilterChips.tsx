import Link from "next/link";
import { X } from "lucide-react";
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
      <span className="text-sm text-brand-400">적용된 필터:</span>
      {chips.map((chip) => (
        <Link
          key={`${chip.key}-${chip.value}`}
          href={buildCatalogHref(query, { [chip.key]: "", page: 1 })}
          scroll={false}
          className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white py-1 pl-3 pr-2 text-sm text-brand-700 hover:border-brand-300 hover:bg-brand-50"
        >
          <span>{chip.label}</span>
          <span className="sr-only">필터 해제</span>
          <X className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
        </Link>
      ))}
      <Link
        href="/products"
        scroll={false}
        className="text-sm font-medium text-accent-700 underline-offset-2 hover:underline"
      >
        전체 초기화
      </Link>
    </div>
  );
}
