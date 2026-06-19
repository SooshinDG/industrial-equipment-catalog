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
        className="whitespace-nowrap text-sm text-brand-500"
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
        className="rounded-md border border-brand-200 bg-white px-3 py-2 text-sm text-brand-700 focus:border-accent-400"
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
