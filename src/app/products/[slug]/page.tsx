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
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryVisual } from "@/components/CategoryVisual";
import { FeaturedBadge, StockBadge } from "@/components/StockBadge";
import { ProductCard } from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

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

  const specRows = [
    { label: "카테고리", value: product.category },
    { label: "제조사", value: product.manufacturer },
    { label: "모델", value: product.model },
    { label: product.mainSpecLabel, value: product.mainSpecValue },
    { label: product.subSpecLabel, value: product.subSpecValue },
    { label: "전압", value: product.voltage },
    { label: "정격 출력", value: formatPower(product.powerKw) },
    { label: "인증", value: product.certification },
  ].filter((row) => row.label && row.value);

  return (
    <div className="container-page py-8">
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

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 비주얼 */}
        <div>
          <CategoryVisual
            category={product.category}
            size="hero"
            className="aspect-[4/3] w-full rounded-xl"
          />
        </div>

        {/* 핵심 정보 */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-brand-400">
              {product.category}
            </span>
            {product.featured && <FeaturedBadge />}
            <StockBadge status={product.stockStatus} />
          </div>

          <h1 className="mt-2 text-2xl font-bold text-brand-900 sm:text-3xl">
            {product.productName}
          </h1>
          <p className="mt-1 text-sm text-brand-400">
            {product.manufacturer} · 모델 {product.model}
          </p>

          <p className="mt-4 text-3xl font-bold text-brand-900">
            {formatKrw(product.priceKrw)}
          </p>

          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3">
              <Clock className="h-5 w-5 text-brand-400" aria-hidden="true" />
              <div>
                <dt className="text-xs text-brand-400">예상 납기</dt>
                <dd className="text-sm font-semibold text-brand-700">
                  {formatLeadTime(product.leadTimeDays)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3">
              <Zap className="h-5 w-5 text-brand-400" aria-hidden="true" />
              <div>
                <dt className="text-xs text-brand-400">전압 / 출력</dt>
                <dd className="text-sm font-semibold text-brand-700">
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
              인증: {product.certification}
            </p>
          )}
        </div>
      </div>

      {/* 사양 + 용도/설명 */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2" aria-labelledby="spec-heading">
          <h2 id="spec-heading" className="text-lg font-bold text-brand-800">
            주요 사양
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-brand-100">
            <table className="w-full text-sm">
              <tbody>
                {specRows.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={idx % 2 === 0 ? "bg-white" : "bg-brand-50"}
                  >
                    <th
                      scope="row"
                      className="w-40 border-b border-brand-100 px-4 py-3 text-left font-medium text-brand-500"
                    >
                      {row.label}
                    </th>
                    <td className="border-b border-brand-100 px-4 py-3 text-brand-800">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="usecase-heading">
          <h2 id="usecase-heading" className="text-lg font-bold text-brand-800">
            용도 및 설명
          </h2>
          <div className="mt-4 rounded-lg border border-brand-100 bg-white p-5">
            {product.useCase && (
              <p className="text-sm font-semibold text-brand-700">
                적용 분야: {product.useCase}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-brand-500">
              {product.summary}
            </p>
          </div>
        </section>
      </div>

      {/* 관련 제품 */}
      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="text-lg font-bold text-brand-800"
          >
            같은 카테고리 추천 제품
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.productId}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
