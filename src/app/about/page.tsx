import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "회사 소개",
  description:
    "에어메이트 산업솔루션은 공장 자동화·설비 유지보수 고객을 위한 가상의 B2B 산업장비 유통사입니다. (포트폴리오 데모)",
};

const STEPS = [
  {
    title: "제품 탐색",
    body: "검색·필터로 설비에 맞는 후보 장비를 빠르게 추립니다.",
  },
  {
    title: "상담",
    body: "사양·납기·수량을 확인하며 적합한 구성을 함께 검토합니다.",
  },
  {
    title: "견적",
    body: "확정된 사양과 수량으로 명확한 견적을 제공합니다.",
  },
  {
    title: "납품",
    body: "일정에 맞춰 납품하고 설치·유지보수까지 안내합니다.",
  },
];

const CRITERIA = [
  "현장에서 자주 쓰이는 검증된 사양 위주로 구성",
  "토출량·압력·전압·납기 등 비교 가능한 핵심 수치를 명시",
  "재고 상태와 예상 납기를 함께 표기해 구매 검토를 단축",
];

export default function AboutPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "회사 소개" }]} />

      <header className="mt-6 max-w-2xl border-b border-brand-200 pb-6">
        <p className="eyebrow">회사 소개</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-900 sm:text-3xl">
          {SITE.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-500">
          공장 자동화와 설비 유지보수 고객을 대상으로 산업용 장비·부품을 공급하는
          가상의 B2B 유통사입니다. 엑셀로만 관리되던 제품 정보를 누구나 검색하고
          조건별로 비교할 수 있는 공개형 카탈로그로 정리했습니다.
        </p>
        <p className="mt-4 inline-flex items-start gap-2 border-l-2 border-accent-500 bg-accent-50 px-3 py-2 text-xs text-accent-800">
          <span className="font-semibold">데모 안내</span>
          <span>
            본 회사·제품·연락처는 실제 기업과 무관한 포트폴리오 시연용 가상
            정보이며, 실제 거래나 결제는 이루어지지 않습니다.
          </span>
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* 취급 분야 */}
        <section aria-labelledby="fields-heading">
          <h2 id="fields-heading" className="text-lg font-bold text-brand-900">
            취급 분야
          </h2>
          <ul className="mt-4 divide-y divide-brand-200 overflow-hidden rounded-sm border border-brand-200 bg-white">
            {CATEGORIES.map((category) => (
              <li key={category.slug} className="flex gap-4 px-4 py-3.5">
                <span className="num w-7 shrink-0 text-sm font-medium text-brand-400">
                  {category.code}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-brand-900">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-brand-500">
                    {category.blurb}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 제품 선정 기준 */}
        <section aria-labelledby="criteria-heading">
          <h2 id="criteria-heading" className="text-lg font-bold text-brand-900">
            제품 선정 기준
          </h2>
          <ul className="mt-4 space-y-3">
            {CRITERIA.map((item) => (
              <li
                key={item}
                className="flex gap-3 border-b border-brand-100 pb-3 text-sm text-brand-600 last:border-b-0"
              >
                <span aria-hidden="true" className="text-accent-500">
                  ▪
                </span>
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-lg font-bold text-brand-900">
            데이터 기반 제품 탐색
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-500">
            모든 제품은 동일한 사양 항목으로 정리되어 있어, 검색·필터·정렬로 조건에
            맞는 장비를 빠르게 좁히고 사양을 나란히 비교할 수 있습니다.
          </p>
        </section>
      </div>

      {/* 진행 절차 — 번호형 목록 */}
      <section className="mt-12" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-lg font-bold text-brand-900">
          상담부터 납품까지
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => (
            <li key={step.title} className="border-t-2 border-brand-800 pt-4">
              <span className="num text-sm text-brand-400">
                STEP {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-brand-900">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-500">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA — 잉크 패널 */}
      <section className="mt-12">
        <div className="flex flex-col items-start gap-6 rounded-sm bg-brand-900 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="text-xl font-bold text-white">
              필요한 장비를 찾고 계신가요?
            </h2>
            <p className="mt-2 text-sm text-brand-200">
              제품을 둘러보거나 바로 견적을 문의해 보세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-md border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              제품 둘러보기
            </Link>
            <Link href="/inquiry" className="btn-primary">
              견적 문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
