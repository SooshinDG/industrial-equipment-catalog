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

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h1 className="text-2xl font-bold text-brand-800">견적 문의</h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-500">
            관심 제품과 필요 수량, 납품 일정을 남겨 주시면 담당자가 확인 후
            견적을 회신해 드립니다.
          </p>
          <div className="mt-5 rounded-lg border border-accent-200 bg-accent-50 p-4">
            <p className="text-sm font-medium text-accent-800">
              실제 문의는 전송되지 않는 데모입니다.
            </p>
            <p className="mt-1 text-xs text-accent-700">
              입력하신 내용은 서버로 전송되지 않고 현재 브라우저에만 임시
              저장됩니다.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-brand-100 bg-white p-6">
            <InquiryForm products={options} initialProduct={validInitial} />
          </div>
        </div>
      </div>
    </div>
  );
}
