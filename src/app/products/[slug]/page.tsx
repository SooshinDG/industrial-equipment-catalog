import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, FileCheck2, MessageSquare, Zap } from "lucide-react";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { formatKrw, formatLeadTime, formatPower } from "@/lib/format";
import { getCategoryMeta } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryVisual } from "@/components/CategoryVisual";
import { FeaturedBadge, StockBadge } from "@/components/StockBadge";

type Params = Promise<{ slug: string }>;

// CSV가 유일한 데이터 소스이므로 빌드 시 모든 제품을 생성하고,
// 목록에 없는 slug는 정식 404(not-found)로 처리한다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "제품을 찾을 수 없습니다" };
  }

  const title = `${product.productName} (${product.model})`;
  const description = `${product.category} · ${product.manufacturer} · ${product.summary}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4);
  const meta = getCategoryMeta(product.category);

  // 사양 행 — mono 플래그로 수치/코드만 등폭 처리
  const specRows: { label: string; value: string; mono?: boolean }[] = [
    { label: "카테고리", value: product.category },
    { label: "제조사", value: product.manufacturer },
    { label: "모델", value: product.model, mono: true },
    { label: "제품 코드", value: product.productId, mono: true },
    { label: product.mainSpecLabel, value: product.mainSpecValue, mono: true },
    { label: product.subSpecLabel, value: product.subSpecValue, mono: true },
    { label: "전압", value: product.voltage, mono: true },
    { label: "정격 출력", value: formatPower(product.powerKw), mono: true },
    { label: "인증", value: product.certification },
  ].filter((row) => row.label && row.value);

  return (
    <div className="container-page py-8 pb-24 lg:pb-12">
      <Breadcrumbs
        items={[
          { label: "홈", href: "/" },
          { label: "제품 찾기", href: "/products" },
          {
            label: product.category,
            href: `/products?category=${encodeURIComponent(product.category)}`,
          },
          { label: product.productName },
        ]}
      />

      {/* 비대칭 2열: 좌측 기술 비주얼(작게) · 우측 핵심 정보(우세) */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* 핵심 정보 — 모바일에서 먼저 노출 */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{product.category}</span>
            {product.featured && <FeaturedBadge />}
            <StockBadge status={product.stockStatus} />
          </div>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-brand-900 sm:text-3xl">
            {product.productName}
          </h1>
          <p className="mt-1 text-sm text-brand-500">
            {product.manufacturer} · 모델{" "}
            <span className="num text-brand-700">{product.model}</span>
          </p>

          <p className="num mt-4 text-3xl font-bold text-brand-900">
            {formatKrw(product.priceKrw)}
          </p>

          {/* 핵심 사양 요약 — 괘선 분리 데이터 블록 */}
          <dl className="mt-5 grid grid-cols-1 overflow-hidden rounded-sm border border-brand-200 sm:grid-cols-2">
            <div className="flex items-center gap-3 border-b border-brand-200 px-4 py-3 sm:border-b-0 sm:border-r">
              <Clock className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true" />
              <div>
                <dt className="text-xs text-brand-400">예상 납기</dt>
                <dd className="num text-sm font-semibold text-brand-800">
                  {formatLeadTime(product.leadTimeDays)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Zap className="h-5 w-5 shrink-0 text-brand-400" aria-hidden="true" />
              <div>
                <dt className="text-xs text-brand-400">전압 / 출력</dt>
                <dd className="num text-sm font-semibold text-brand-800">
                  {product.voltage} · {formatPower(product.powerKw)}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
              className="btn-primary"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />이 제품 견적
              문의
            </Link>
            <Link href="/products" className="btn-secondary">
              목록으로
            </Link>
          </div>

          {product.certification && product.certification !== "해당 없음" && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-500">
              <FileCheck2 className="h-4 w-4" aria-hidden="true" />
              인증: <span className="font-medium text-brand-700">{product.certification}</span>
            </p>
          )}
        </div>

        {/* 기술 비주얼 + 장비 라벨 플레이트 */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="overflow-hidden rounded-sm border border-brand-200 bg-white">
            <CategoryVisual
              category={product.category}
              size="hero"
              className="aspect-[16/9] w-full sm:aspect-[4/3]"
            />
            <div className="flex items-center justify-between border-t border-brand-200 px-4 py-2.5">
              <span className="num text-[11px] font-medium text-brand-500">
                {meta.code}-{product.productId}
              </span>
              <span className="num text-[11px] text-brand-500">
                모델 {product.model}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 사양 + 용도/설명 */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="spec-heading">
          <h2 id="spec-heading" className="text-lg font-bold text-brand-900">
            주요 사양
          </h2>
          <div className="mt-4 overflow-hidden rounded-sm border border-brand-200">
            <table className="w-full text-sm">
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label} className="border-b border-brand-100 last:border-b-0">
                    <th
                      scope="row"
                      className="w-36 bg-brand-50 px-4 py-2.5 text-left align-top font-medium text-brand-500 sm:w-44"
                    >
                      {row.label}
                    </th>
                    <td
                      className={`px-4 py-2.5 text-brand-900 ${
                        row.mono ? "num" : ""
                      }`}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="usecase-heading">
          <h2 id="usecase-heading" className="text-lg font-bold text-brand-900">
            용도 및 설명
          </h2>
          <div className="mt-4 rounded-sm border border-brand-200 bg-white p-5">
            {product.useCase && (
              <>
                <p className="eyebrow">적용 분야</p>
                <p className="mt-0.5 text-sm font-semibold text-brand-800">
                  {product.useCase}
                </p>
              </>
            )}
            <p className="mt-3 text-sm leading-relaxed text-brand-500">
              {product.summary}
            </p>
          </div>
        </section>
      </div>

      {/* 관련 제품 — 비교용 컴팩트 기술 목록 */}
      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-bold text-brand-900">
            같은 카테고리 추천 제품
          </h2>
          <ul className="mt-4 divide-y divide-brand-200 overflow-hidden rounded-sm border border-brand-200 bg-white">
            {related.map((item) => {
              const spec =
                item.mainSpecValue &&
                `${item.mainSpecLabel} ${item.mainSpecValue}`;
              return (
                <li key={item.productId}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-brand-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-brand-900">
                        {item.productName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-brand-500">
                        <span className="num">{item.model}</span>
                        {spec && (
                          <>
                            {" · "}
                            <span className="num">{spec}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-sm font-semibold text-brand-900">
                        {formatKrw(item.priceKrw)}
                      </p>
                      <p className="num mt-0.5 text-[11px] text-brand-400">
                        {formatLeadTime(item.leadTimeDays)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 모바일 하단 sticky 문의 — 콘텐츠는 pb-24로 확보 */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-brand-200 bg-paper/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="num text-base font-bold leading-tight text-brand-900">
            {formatKrw(product.priceKrw)}
          </p>
          <p className="num truncate text-[11px] text-brand-400">
            {product.stockStatus} · {formatLeadTime(product.leadTimeDays)}
          </p>
        </div>
        <Link
          href={`/inquiry?product=${encodeURIComponent(product.slug)}`}
          className="btn-primary shrink-0"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          견적 문의
        </Link>
      </div>
    </div>
  );
}
