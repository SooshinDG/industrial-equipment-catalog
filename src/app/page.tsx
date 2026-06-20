import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";
import {
  getAllProducts,
  getCategoryCounts,
  getFeaturedProducts,
} from "@/lib/products";
import { formatKrw, formatLeadTime } from "@/lib/format";
import { HomeSearch } from "@/components/HomeSearch";
import { CategoryVisual } from "@/components/CategoryVisual";
import { StockBadge } from "@/components/StockBadge";

// 데이터 기반 카탈로그의 운영 원칙 — 아이콘 카드 대신 번호형 목록으로 제시
const PRINCIPLES = [
  {
    title: "데이터 기반 검색",
    body: "엑셀에 흩어진 사양을 검색·필터·정렬로 좁혀, 현장에 맞는 장비를 빠르게 찾습니다.",
  },
  {
    title: "명확한 사양 표기",
    body: "토출량·압력·전압·납기 등 핵심 수치를 카드와 상세 데이터시트로 일관되게 제공합니다.",
  },
  {
    title: "빠른 견적 연결",
    body: "관심 제품을 그대로 견적 문의에 담아, 구매 검토 시간을 단축합니다.",
  },
];

export default async function HomePage() {
  const [products, featured, categoryCounts] = await Promise.all([
    getAllProducts(),
    getFeaturedProducts(6),
    getCategoryCounts(),
  ]);
  const countByCategory = new Map(
    categoryCounts.map((c) => [c.category, c.count]),
  );
  const totalCount = products.length;
  const [lead, ...rest] = featured;

  return (
    <>
      {/* 히어로 — 카탈로그 표지(비대칭 편집 레이아웃) */}
      <section className="border-b border-brand-200">
        <div className="container-page grid grid-cols-1 gap-8 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">산업 장비 · 부품 B2B 카탈로그</p>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-tight text-brand-900 sm:text-4xl lg:text-5xl">
              {SITE.tagline}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-500 sm:text-base">
              공기압축기부터 펌프·모터·밸브·센서까지, 조건별 검색으로 설비에 맞는
              제품을 빠르게 비교하고 견적까지 연결하세요.
            </p>
            <div className="mt-7">
              <HomeSearch />
            </div>
          </div>

          {/* 기술 요약 — 데이터시트 톤 */}
          <div className="lg:col-span-5 lg:border-l lg:border-brand-200 lg:pl-10">
            <p className="eyebrow">카탈로그 요약</p>
            <dl className="mt-3 divide-y divide-brand-200 border-y border-brand-200">
              <div className="flex items-baseline justify-between py-3">
                <dt className="text-sm text-brand-500">등록 제품</dt>
                <dd className="num text-xl font-bold text-brand-900">
                  {totalCount}
                </dd>
              </div>
              <div className="flex items-baseline justify-between py-3">
                <dt className="text-sm text-brand-500">취급 카테고리</dt>
                <dd className="num text-xl font-bold text-brand-900">
                  {CATEGORIES.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-sm text-brand-500">검색 기준</dt>
                <dd className="text-right text-xs font-medium text-brand-600">
                  제품명 · 모델 · 용도 · 제조사
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 카테고리 색인 */}
      <section className="container-page py-12" aria-labelledby="category-heading">
        <div className="flex items-end justify-between border-b border-brand-200 pb-3">
          <div>
            <h2 id="category-heading" className="text-lg font-bold text-brand-900">
              카테고리 색인
            </h2>
            <p className="mt-1 text-sm text-brand-500">
              취급 분야별로 제품을 살펴보세요.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-900 sm:inline-flex"
          >
            전체 제품 보기
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-brand-200 overflow-hidden rounded-sm border border-brand-200 bg-white">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-brand-50"
              >
                <span className="num w-7 shrink-0 text-sm font-medium text-brand-400">
                  {category.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-brand-900">
                    {category.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-brand-500">
                    {category.blurb}
                  </p>
                </div>
                <span className="num shrink-0 text-sm text-brand-600">
                  {countByCategory.get(category.name) ?? 0}개
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-brand-300 transition-colors group-hover:text-brand-700"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 추천 제품 — 대표 1개 + 컴팩트 목록(편집 리듬) */}
      {lead && (
        <section className="bg-brand-50" aria-labelledby="featured-heading">
          <div className="container-page py-12">
            <div className="flex items-end justify-between border-b border-brand-200 pb-3">
              <div>
                <h2
                  id="featured-heading"
                  className="text-lg font-bold text-brand-900"
                >
                  추천 제품
                </h2>
                <p className="mt-1 text-sm text-brand-500">
                  현장에서 자주 찾는 대표 장비입니다.
                </p>
              </div>
              <Link
                href="/products?sort=featured"
                className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-900 sm:inline-flex"
              >
                더 보기
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
              {/* 대표 추천 */}
              <article className="overflow-hidden rounded-sm border border-brand-200 bg-white lg:col-span-7">
                <Link
                  href={`/products/${lead.slug}`}
                  className="flex h-full flex-col sm:flex-row"
                >
                  <CategoryVisual
                    category={lead.category}
                    size="hero"
                    className="h-40 w-full shrink-0 sm:h-auto sm:w-2/5"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="eyebrow">{lead.category}</span>
                      <StockBadge status={lead.stockStatus} />
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-brand-900">
                      {lead.productName}
                    </h3>
                    <p className="mt-1 text-xs text-brand-500">
                      {lead.manufacturer} ·{" "}
                      <span className="num text-brand-600">{lead.model}</span>
                    </p>
                    {lead.mainSpecValue && (
                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-brand-100 pt-3 text-xs">
                        <div className="flex items-baseline gap-1.5">
                          <dt className="text-brand-400">{lead.mainSpecLabel}</dt>
                          <dd className="num font-medium text-brand-800">
                            {lead.mainSpecValue}
                          </dd>
                        </div>
                        {lead.subSpecValue && (
                          <div className="flex items-baseline gap-1.5">
                            <dt className="text-brand-400">
                              {lead.subSpecLabel}
                            </dt>
                            <dd className="num font-medium text-brand-800">
                              {lead.subSpecValue}
                            </dd>
                          </div>
                        )}
                      </dl>
                    )}
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <p className="num text-xl font-bold text-brand-900">
                        {formatKrw(lead.priceKrw)}
                      </p>
                      <p className="num text-xs text-brand-400">
                        {formatLeadTime(lead.leadTimeDays)}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>

              {/* 나머지 추천 — 컴팩트 기술 목록 */}
              <ul className="divide-y divide-brand-200 overflow-hidden rounded-sm border border-brand-200 bg-white lg:col-span-5">
                {rest.map((item) => (
                  <li key={item.productId}>
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-brand-900">
                          {item.productName}
                        </p>
                        <p className="num mt-0.5 truncate text-xs text-brand-500">
                          {item.model}
                        </p>
                      </div>
                      <p className="num shrink-0 text-sm font-semibold text-brand-900">
                        {formatKrw(item.priceKrw)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 운영 원칙 — 번호형 목록 */}
      <section
        className="container-page py-12"
        aria-labelledby="principle-heading"
      >
        <h2 id="principle-heading" className="sr-only">
          데이터 기반 카탈로그의 장점
        </h2>
        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PRINCIPLES.map((item, idx) => (
            <li key={item.title} className="border-t-2 border-brand-800 pt-4">
              <span className="num text-sm text-brand-400">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-brand-900">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-500">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 하단 CTA — 잉크 패널 */}
      <section className="container-page pb-14">
        <div className="flex flex-col items-start gap-6 rounded-sm bg-brand-900 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              찾는 장비가 있으신가요?
            </h2>
            <p className="mt-2 text-sm text-brand-200">
              제품을 검색해 비교하거나, 관심 제품을 담아 견적을 문의하세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              제품 검색
            </Link>
            <Link href="/inquiry" className="btn-primary">
              견적 문의하기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
