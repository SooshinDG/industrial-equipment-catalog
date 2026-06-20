import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="num text-sm font-medium text-brand-400">ERR 404</p>
      <h1 className="mt-3 text-2xl font-bold text-brand-900 sm:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-500">
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
