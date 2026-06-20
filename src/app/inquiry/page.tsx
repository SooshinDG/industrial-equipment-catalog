import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm, type ProductOption } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "견적 문의",
  description:
    "관심 제품과 수량을 남기면 담당자가 확인 후 견적을 회신해 드립니다. (포트폴리오 데모)",
};

type SearchParams = Promise<{ product?: string | string[] }>;

const PROCESS = [
  "제품 탐색 후 관심 제품과 수량을 남깁니다.",
  "담당자가 사양·납기·재고를 확인합니다.",
  "확정 사양으로 견적을 회신합니다.",
  "일정에 맞춰 납품·설치를 안내합니다.",
];

const PREPARE = [
  "필요 사양과 수량",
  "설치 환경 또는 사용 조건",
  "희망 납품 일정",
  "관련 도면·규격이 있으면 함께",
];

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { product } = await searchParams;
  const initialProduct = Array.isArray(product) ? product[0] : product;

  const products = await getAllProducts();
  const options: ProductOption[] = products.map((p) => ({
    slug: p.slug,
    label: `${p.productName} (${p.model})`,
    category: p.category,
  }));

  // 유효하지 않은 slug는 미선택 처리
  const validInitial = options.some((o) => o.slug === initialProduct)
    ? initialProduct
    : undefined;

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[{ label: "홈", href: "/" }, { label: "견적 문의" }]}
      />

      <div className="mt-6 max-w-2xl border-b border-brand-200 pb-6">
        <h1 className="text-2xl font-bold text-brand-900">견적 문의</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-500">
          관심 제품과 필요 수량, 납품 일정을 남겨 주시면 담당자가 확인 후 견적을
          회신해 드립니다.
        </p>
        <p className="mt-3 inline-flex items-start gap-2 border-l-2 border-accent-500 bg-accent-50 px-3 py-2 text-xs text-accent-800">
          <span className="font-semibold">데모 안내</span>
          <span>
            실제 문의는 전송되지 않으며, 입력 내용은 현재 브라우저에만 임시
            저장됩니다.
          </span>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* 폼 — 모바일에서 먼저 */}
        <div className="order-1 lg:order-2 lg:col-span-2">
          <h2 className="sr-only">문의 정보 입력</h2>
          <InquiryForm products={options} initialProduct={validInitial} />
        </div>

        {/* 정보 영역 */}
        <aside className="order-2 space-y-8 lg:order-1 lg:col-span-1">
          <section>
            <h2 className="text-sm font-bold text-brand-900">견적 처리 절차</h2>
            <ol className="mt-3 divide-y divide-brand-100 border-y border-brand-200">
              {PROCESS.map((step, idx) => (
                <li key={step} className="flex gap-3 py-2.5">
                  <span className="num shrink-0 text-sm font-medium text-brand-400">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-brand-600">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-sm font-bold text-brand-900">
              준비하면 좋은 정보
            </h2>
            <ul className="mt-3 space-y-1.5">
              {PREPARE.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-brand-600"
                >
                  <span aria-hidden="true" className="text-brand-300">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-brand-900">데이터 처리</h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-500">
              입력 내용은 외부 서버로 전송되지 않습니다. 데모 시연을 위해 사용
              중인 브라우저의 localStorage에만 저장되며, 언제든 삭제할 수
              있습니다.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
