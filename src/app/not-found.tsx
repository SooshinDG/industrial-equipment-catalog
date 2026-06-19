import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-400">
        <Compass className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-bold text-accent-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-brand-800">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-500">
        주소가 변경되었거나 존재하지 않는 페이지입니다. 홈이나 제품 목록에서 다시
        찾아보세요.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">
          홈으로
        </Link>
        <Link href="/products" className="btn-secondary">
          제품 목록 보기
        </Link>
      </div>
    </div>
  );
}
