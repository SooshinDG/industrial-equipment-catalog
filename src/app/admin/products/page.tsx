import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Factory } from "lucide-react";
import { getAdminUser } from "@/lib/auth/admin";
import { fetchProductCounts } from "@/lib/products/admin-store";
import { AdminUploader } from "@/components/admin/AdminUploader";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "제품 데이터 관리",
  robots: { index: false, follow: false },
};

// 세션/제품 수를 매 요청 기준으로 (정적 캐시하지 않음)
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  // 미들웨어 게이트에 더해, 페이지에서도 다시 검증(방어적)
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login?redirect=/admin/products");
  }

  const counts = await fetchProductCounts();

  return (
    <div className="container-page py-8">
      {/* 상단 바 */}
      <div className="flex flex-col gap-4 border-b border-brand-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-900 text-white">
              <Factory className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <h1 className="text-base font-bold">제품 데이터 관리</h1>
              <p className="num text-[10px] font-medium tracking-tight text-brand-400">
                ADMIN CONSOLE
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="num hidden text-xs text-brand-500 sm:inline">
            {admin.email}
          </span>
          <LogoutButton />
        </div>
      </div>

      <p className="mt-4 inline-flex items-start gap-2 border-l-2 border-accent-500 bg-accent-50 px-3 py-2 text-xs text-accent-800">
        <span className="font-semibold">데모 안내</span>
        <span>
          이 콘솔은 포트폴리오 데모 데이터를 관리합니다. 업로드는 product_id 기준
          upsert 이며, 파일에 없는 제품은 삭제되지 않습니다.
        </span>
      </p>

      <div className="mt-6">
        <AdminUploader counts={counts} />
      </div>
    </div>
  );
}
