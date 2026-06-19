"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { buildCatalogHref, type CatalogQuery } from "@/lib/catalog";

export function CatalogSearch({ query }: { query: CatalogQuery }) {
  const router = useRouter();
  const [value, setValue] = useState(query.q);

  // 뒤로가기/칩 해제 등으로 URL의 q가 바뀌면 입력값도 동기화
  useEffect(() => {
    setValue(query.q);
  }, [query.q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 변경 시 1페이지로 초기화, 나머지 필터는 유지
    router.push(buildCatalogHref(query, { q: value.trim(), page: 1 }), {
      scroll: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <label htmlFor="catalog-search" className="sr-only">
        제품명, 모델, 용도, 제조사로 검색
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300"
          aria-hidden="true"
        />
        <input
          id="catalog-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="제품명, 모델, 용도, 제조사 검색"
          className="w-full rounded-md border border-brand-200 bg-white py-2.5 pl-11 pr-24 text-sm text-brand-800 placeholder:text-brand-300 focus:border-accent-400"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-brand-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
        >
          검색
        </button>
      </div>
    </form>
  );
}
