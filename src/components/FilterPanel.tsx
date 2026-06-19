import Link from "next/link";
import { Check } from "lucide-react";
import {
  buildCatalogHref,
  PRICE_RANGES,
  type CatalogQuery,
} from "@/lib/catalog";
import type { StockStatus } from "@/lib/types";

interface FilterPanelProps {
  query: CatalogQuery;
  facets: {
    categories: string[];
    voltages: string[];
    stockStatuses: StockStatus[];
  };
}

interface OptionGroupProps {
  legend: string;
  paramKey: keyof CatalogQuery;
  options: { value: string; label: string }[];
  query: CatalogQuery;
}

/** 선택 시 해당 필터를 토글하고 page를 1로 초기화하는 링크 목록 */
function OptionGroup({ legend, paramKey, options, query }: OptionGroupProps) {
  const current = String(query[paramKey] ?? "");
  const hasSelection = current !== "";

  return (
    <fieldset className="border-t border-brand-200 py-3.5 first:border-t-0 first:pt-0">
      <legend className="mb-1.5 flex w-full items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-brand-800">
          {legend}
        </span>
        {hasSelection && (
          <span className="num text-[11px] text-brand-400">1개 선택</span>
        )}
      </legend>
      <ul className="-mx-1.5">
        {options.map((option) => {
          const selected = current === option.value;
          const href = buildCatalogHref(query, {
            [paramKey]: selected ? "" : option.value,
            page: 1,
          });
          return (
            <li key={option.value}>
              <Link
                href={href}
                aria-pressed={selected}
                scroll={false}
                className={`group flex min-h-[2.5rem] items-center gap-2.5 rounded px-1.5 text-sm transition-colors ${
                  selected
                    ? "text-brand-900"
                    : "text-brand-600 hover:bg-brand-50"
                }`}
              >
                {/* 선택 상태 표시 — 강조에만 앰버 사용 */}
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border ${
                    selected
                      ? "border-accent-500 bg-accent-500 text-brand-900"
                      : "border-brand-300 bg-white group-hover:border-brand-400"
                  }`}
                >
                  {selected && (
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  )}
                </span>
                <span className={selected ? "font-medium" : undefined}>
                  {option.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function FilterPanel({ query, facets }: FilterPanelProps) {
  return (
    <div>
      <OptionGroup
        legend="카테고리"
        paramKey="category"
        query={query}
        options={facets.categories.map((c) => ({ value: c, label: c }))}
      />
      <OptionGroup
        legend="전압"
        paramKey="voltage"
        query={query}
        options={facets.voltages.map((v) => ({ value: v, label: v }))}
      />
      <OptionGroup
        legend="재고 상태"
        paramKey="stock"
        query={query}
        options={facets.stockStatuses.map((s) => ({ value: s, label: s }))}
      />
      <OptionGroup
        legend="가격대"
        paramKey="price"
        query={query}
        options={PRICE_RANGES.map((r) => ({ value: r.value, label: r.label }))}
      />
    </div>
  );
}
