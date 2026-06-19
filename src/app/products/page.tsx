import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getAllProducts, getFilterFacets } from "@/lib/products";
import {
  hasActiveFilters,
  parseCatalogQuery,
  queryCatalog,
  getActiveChips,
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
  const activeCount = getActiveChips(query).length;

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[{ label: "홈", href: "/" }, { label: "제품 찾기" }]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-brand-800">제품 찾기</h1>
        <p className="mt-1 text-sm text-brand-400">
          조건을 선택해 설비에 맞는 장비를 비교해 보세요.
        </p>
      </div>

      {/* 검색 + 정렬 툴바 */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <CatalogSearch query={query} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="lg:hidden">
            <MobileFilterDrawer activeCount={activeCount}>
              <FilterPanel query={query} facets={facets} />
            </MobileFilterDrawer>
          </div>
          <SortSelect query={query} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* 데스크톱 사이드 필터 */}
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="필터">
          <div className="sticky top-20 rounded-lg border border-brand-100 bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-brand-800">필터</h2>
            <FilterPanel query={query} facets={facets} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* 결과 개수 + 칩 */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-brand-500" aria-live="polite">
              검색 결과{" "}
              <span className="font-semibold text-brand-800">
                {result.total}
              </span>
              개
            </p>
            <FilterChips query={query} />
          </div>

          {result.items.length > 0 ? (
            <>
              <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
    <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-brand-200 bg-brand-50 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-400">
        <PackageSearch className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-brand-800">
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
