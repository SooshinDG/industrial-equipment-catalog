import Link from "next/link";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-400">
        <PackageX className="h-8 w-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-brand-800">
        제품을 찾을 수 없습니다
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-500">
        요청하신 제품이 존재하지 않거나 주소가 변경되었을 수 있습니다. 전체
        제품에서 다시 찾아보세요.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/products" className="btn-primary">
          제품 목록 보기
        </Link>
        <Link href="/" className="btn-secondary">
          홈으로
        </Link>
      </div>
    </div>
  );
}
