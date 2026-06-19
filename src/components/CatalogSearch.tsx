"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { buildCatalogHref, type CatalogQuery } from "@/lib/catalog";

export function CatalogSearch({ query }: { query: CatalogQuery }) {
  const router = useRouter();
  const [value, setValue] = useState(query.q);

  // 뒤로가기/칩 해제 등으로 URL의 q가 바뀌면 입력값도 동기화
  useEffect(() => {
    setValue(query.q);
  }, [query.q]);

  // 검색 변경 시 1페이지로 초기화, 나머지 필터는 유지 (URL query 동기화)
  const submit = (next: string) => {
    router.push(buildCatalogHref(query, { q: next.trim(), page: 1 }), {
      scroll: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(value);
  };

  const handleClear = () => {
    setValue("");
    submit("");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full sm:max-w-md">
      <label htmlFor="catalog-search" className="sr-only">
        제품명, 모델, 용도, 제조사로 검색
      </label>
      <div className="flex items-stretch">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="제품명, 모델, 용도, 제조사 검색"
            className="h-11 w-full rounded-l-md border border-brand-300 bg-white pl-9 pr-9 text-sm text-brand-800 placeholder:text-brand-300 focus:z-10 focus:border-accent-400 [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="검색어 지우기"
              className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-brand-400 hover:bg-brand-50 hover:text-brand-700"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center rounded-r-md border border-l-0 border-brand-800 bg-brand-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          검색
        </button>
      </div>
    </form>
  );
}
