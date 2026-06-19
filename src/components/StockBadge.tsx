import { getStockBadge } from "@/lib/format";
import type { StockStatus } from "@/lib/types";

/**
 * 재고 상태 배지 — 의미 있는 상태이므로 pill 형태를 유지하되,
 * 색 면을 넓게 쓰지 않고 상태 도트 + 차분한 텍스트로 표현한다.
 */
export function StockBadge({ status }: { status: StockStatus }) {
  const badge = getStockBadge(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-2 py-0.5 text-[11px] font-medium text-brand-600">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${badge.dot}`}
      />
      {badge.label}
    </span>
  );
}

/** 추천 배지 — 강조 요소이므로 앰버를 제한적으로 사용 */
export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-semibold text-brand-900">
      추천
    </span>
  );
}
