import Link from "next/link";
import { ArrowRight, Database, FileText, MessageSquare } from "lucide-react";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";
import { getCategoryCounts, getFeaturedProducts } from "@/lib/products";
import { HomeSearch } from "@/components/HomeSearch";
import { ProductCard } from "@/components/ProductCard";
import { CategoryVisual } from "@/components/CategoryVisual";

const ADVANTAGES = [
  {
    icon: Database,
    title: "데이터 기반 검색",
    body: "엑셀에 흩어진 사양을 검색·필터·정렬로 빠르게 좁혀, 현장에 맞는 장비를 즉시 찾습니다.",
  },
  {
    icon: FileText,
    title: "명확한 사양",
    body: "토출량·압력·전압·납기 등 핵심 수치를 카드와 상세 표로 일관되게 제공합니다.",
  },
  {
    icon: MessageSquare,
    title: "빠른 견적 상담",
    body: "관심 제품을 담아 견적 문의로 바로 연결, 구매 검토 시간을 단축합니다.",
  },
];

export default async function HomePage() {
  const [featured, categoryCounts] = await Promise.all([
    getFeaturedProducts(6),
    getCategoryCounts(),
  ]);
  const countByCategory = new Map(
    categoryCounts.map((c) => [c.category, c.count]),
  );

  return (
    <>
      {/* 히어로 */}
      <section className="border-b border-brand-100 bg-brand-50">
        <div className="container-page py-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-500">
              산업용 장비 · 부품 B2B 카탈로그
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-900 sm:text-4xl">
              {SITE.tagline}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-brand-500">
              공기압축기부터 펌프·모터·밸브·센서까지, 조건별 검색으로 설비에 맞는
              제품을 빠르게 비교하고 견적까지 연결하세요.
            </p>
            <div className="mt-8">
              <HomeSearch />
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 바로가기 */}
      <section className="container-page py-14" aria-labelledby="category-heading">
        <div className="flex items-end justify-between">
          <div>
            <h2
              id="category-heading"
              className="text-xl font-bold text-brand-800"
            >
              카테고리
            </h2>
            <p className="mt-1 text-sm text-brand-400">
              취급 분야별로 제품을 살펴보세요.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 sm:inline-flex"
          >
            전체 제품 보기
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col rounded-lg border border-brand-100 bg-white p-4 transition-colors hover:border-brand-200"
              >
                <CategoryVisual
                  category={category.name}
                  className="h-20 w-full rounded-md"
                />
                <h3 className="mt-3 text-sm font-semibold text-brand-800">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-brand-400">
                  제품 {countByCategory.get(category.name) ?? 0}개
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 추천 제품 */}
      <section className="bg-brand-50" aria-labelledby="featured-heading">
        <div className="container-page py-14">
          <div className="flex items-end justify-between">
            <div>
              <h2
                id="featured-heading"
                className="text-xl font-bold text-brand-800"
              >
                추천 제품
              </h2>
              <p className="mt-1 text-sm text-brand-400">
                현장에서 자주 찾는 대표 장비입니다.
              </p>
            </div>
            <Link
              href="/products?sort=featured"
              className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 sm:inline-flex"
            >
              더 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <li key={product.productId}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 서비스 장점 */}
      <section
        className="container-page py-14"
        aria-labelledby="advantage-heading"
      >
        <h2 id="advantage-heading" className="sr-only">
          서비스 장점
        </h2>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ADVANTAGES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="rounded-lg border border-brand-100 bg-white p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-800 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-brand-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-500">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 하단 CTA */}
      <section className="bg-brand-800">
        <div className="container-page flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              찾는 장비가 있으신가요?
            </h2>
            <p className="mt-2 text-sm text-brand-200">
              관심 제품을 선택해 견적을 문의하면 빠르게 상담해 드립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-secondary">
              제품 둘러보기
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
