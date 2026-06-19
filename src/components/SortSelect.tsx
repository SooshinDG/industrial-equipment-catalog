"use client";

import { useRouter } from "next/navigation";
import {
  buildCatalogHref,
  SORT_OPTIONS,
  type CatalogQuery,
  type SortValue,
} from "@/lib/catalog";

export function SortSelect({ query }: { query: CatalogQuery }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="whitespace-nowrap text-xs font-medium text-brand-400"
      >
        정렬
      </label>
      <select
        id="sort-select"
        value={query.sort}
        onChange={(e) => {
          const sort = e.target.value as SortValue;
          // 정렬 변경 시 1페이지로 이동
          router.push(buildCatalogHref(query, { sort, page: 1 }), {
            scroll: false,
          });
        }}
        className="h-11 rounded-md border border-brand-300 bg-white pl-3 pr-8 text-sm font-medium text-brand-700 focus:border-accent-400"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
