import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="num text-sm font-medium text-brand-400">제품 없음 · 404</p>
      <h1 className="mt-3 text-2xl font-bold text-brand-900 sm:text-3xl">
        제품을 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-500">
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
