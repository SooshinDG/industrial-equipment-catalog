import type { Metadata } from "next";
import Link from "next/link";
import { Search, MessagesSquare, FileText, Truck } from "lucide-react";
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
    icon: Search,
    title: "제품 탐색",
    body: "검색·필터로 설비에 맞는 후보 장비를 빠르게 추립니다.",
  },
  {
    icon: MessagesSquare,
    title: "상담",
    body: "사양·납기·수량을 확인하며 적합한 구성을 함께 검토합니다.",
  },
  {
    icon: FileText,
    title: "견적",
    body: "확정된 사양과 수량으로 명확한 견적을 제공합니다.",
  },
  {
    icon: Truck,
    title: "납품",
    body: "일정에 맞춰 납품하고 설치·유지보수까지 안내합니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "회사 소개" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-brand-800 sm:text-3xl">
          {SITE.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-500">
          저희는 공장 자동화와 설비 유지보수 고객을 대상으로 산업용 장비·부품을
          공급하는 가상의 B2B 유통사입니다. 엑셀로만 관리되던 제품 정보를
          누구나 검색하고 조건별로 비교할 수 있는 공개형 카탈로그로 정리했습니다.
        </p>
      </header>

      <div className="mt-6 rounded-lg border border-accent-200 bg-accent-50 p-4">
        <p className="text-sm font-medium text-accent-800">
          {SITE.demoNotice}
        </p>
        <p className="mt-1 text-xs text-accent-700">
          본 회사·제품·연락처는 실제 기업과 무관한 포트폴리오 시연용 가상
          정보이며, 실제 거래나 결제는 이루어지지 않습니다.
        </p>
      </div>

      {/* 취급 분야 */}
      <section className="mt-12" aria-labelledby="fields-heading">
        <h2 id="fields-heading" className="text-lg font-bold text-brand-800">
          취급 분야
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <li
                key={category.slug}
                className="rounded-lg border border-brand-100 bg-white p-5"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-md ${category.block}`}
                >
                  <Icon
                    className={`h-5 w-5 ${category.accent}`}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-3 text-base font-semibold text-brand-800">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-brand-500">{category.blurb}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 진행 절차 */}
      <section className="mt-12" aria-labelledby="process-heading">
        <h2 id="process-heading" className="text-lg font-bold text-brand-800">
          진행 절차
        </h2>
        <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-lg border border-brand-100 bg-white p-5"
              >
                <span className="text-xs font-bold text-accent-600">
                  STEP {idx + 1}
                </span>
                <span className="mt-2 flex h-10 w-10 items-center justify-center rounded-md bg-brand-800 text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-brand-800">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-brand-500">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-xl bg-brand-800 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-white">
          필요한 장비를 찾고 계신가요?
        </h2>
        <p className="mt-2 text-sm text-brand-200">
          제품을 둘러보거나 바로 견적을 문의해 보세요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-secondary">
            제품 둘러보기
          </Link>
          <Link href="/inquiry" className="btn-primary">
            견적 문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
