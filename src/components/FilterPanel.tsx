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

  return (
    <fieldset className="border-t border-brand-100 py-4 first:border-t-0 first:pt-0">
      <legend className="mb-2 text-sm font-semibold text-brand-700">
        {legend}
      </legend>
      <ul className="space-y-1">
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
                className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                  selected
                    ? "bg-brand-800 text-white"
                    : "text-brand-600 hover:bg-brand-50"
                }`}
              >
                <span>{option.label}</span>
                {selected && <Check className="h-4 w-4" aria-hidden="true" />}
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
