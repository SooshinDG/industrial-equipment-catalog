import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getAllProducts, getFilterFacets } from "@/lib/products";
import {
  hasActiveFilters,
  parseCatalogQuery,
  queryCatalog,
} from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { FilterPanel } from "@/components/FilterPanel";
import { FilterChips } from "@/components/FilterChips";
import { SortSelect } from "@/components/SortSelect";
import { CatalogSearch } from "@/components/CatalogSearch";
import { Pagination } from "@/components/Pagination";
import { MobileFilterDrawer } from "@/components/MobileFilterDrawer";

export const metadata: Metadata = {
  title: "제품 찾기",
  description:
    "공기압축기·펌프·모터·밸브·센서 등 산업용 장비를 검색·필터·정렬로 빠르게 찾아보세요.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = parseCatalogQuery(params);

  const [products, facets] = await Promise.all([
    getAllProducts(),
    getFilterFacets(),
  ]);

  const result = queryCatalog(products, query);
  // 적용된 "필터" 개수(검색어 제외) — 드로어 배지·결과 헤더에 사용. (로직 변경 아님)
  const filterCount = [
    query.category,
    query.voltage,
    query.stock,
    query.price,
  ].filter(Boolean).length;

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[{ label: "홈", href: "/" }, { label: "제품 찾기" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-brand-900">제품 찾기</h1>
        <p className="mt-1 text-sm text-brand-500">
          조건을 선택해 설비에 맞는 장비를 비교해 보세요.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* 데스크톱 사이드 필터 — 카드가 아닌 괘선 패널 */}
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="필터">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b-2 border-brand-800 pb-2">
              <h2 className="text-sm font-bold text-brand-900">필터</h2>
              {filterCount > 0 && (
                <span className="num text-[11px] text-brand-400">
                  {filterCount}개 적용
                </span>
              )}
            </div>
            <FilterPanel query={query} facets={facets} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* 검색 도구 (컴팩트) */}
          <CatalogSearch query={query} />

          {/* 결과 헤더 — 카드 없이 괘선 + 타이포 위계로 구분 */}
          <div className="mt-5 flex flex-col gap-3 border-b border-brand-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="flex items-baseline gap-1.5 text-brand-900"
                aria-live="polite"
              >
                <span className="num text-2xl font-bold">{result.total}</span>
                <span className="text-sm text-brand-500">개 제품</span>
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-brand-500">
                {query.q && (
                  <span>
                    검색어{" "}
                    <span className="font-medium text-brand-700">
                      &ldquo;{query.q}&rdquo;
                    </span>
                  </span>
                )}
                {query.q && filterCount > 0 && (
                  <span aria-hidden="true" className="text-brand-300">
                    ·
                  </span>
                )}
                {filterCount > 0 && (
                  <span>
                    필터{" "}
                    <span className="num font-medium text-brand-700">
                      {filterCount}
                    </span>
                    개 적용
                  </span>
                )}
                {!query.q && filterCount === 0 && <span>전체 제품</span>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <MobileFilterDrawer activeCount={filterCount}>
                  <FilterPanel query={query} facets={facets} />
                </MobileFilterDrawer>
              </div>
              <SortSelect query={query} />
            </div>
          </div>

          {/* 적용된 필터 칩 — 조건이 있을 때만(빈 영역 방지) */}
          {hasActiveFilters(query) && (
            <div className="mt-4">
              <FilterChips query={query} />
            </div>
          )}

          {result.items.length > 0 ? (
            <>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((product) => (
                  <li key={product.productId}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
              <Pagination
                query={query}
                page={result.page}
                pageCount={result.pageCount}
              />
            </>
          ) : (
            <EmptyState filtered={hasActiveFilters(query)} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-sm border border-dashed border-brand-300 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-sm border border-brand-200 bg-brand-50 text-brand-400">
        <PackageSearch className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-brand-900">
        조건에 맞는 제품이 없습니다
      </h2>
      <p className="mt-2 max-w-sm text-sm text-brand-500">
        {filtered
          ? "검색어나 필터 조건을 바꾸거나 초기화한 뒤 다시 시도해 보세요."
          : "현재 표시할 제품이 없습니다. 잠시 후 다시 확인해 주세요."}
      </p>
      {filtered && (
        <Link href="/products" className="btn-primary mt-6">
          필터 초기화
        </Link>
      )}
    </div>
  );
}
