import type { StockStatus } from "./types";

const KRW_FORMATTER = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

/** 가격을 한국 원화 형식으로 표시 (예: ₩10,320,000) */
export function formatKrw(value: number): string {
  if (!Number.isFinite(value)) return "가격 문의";
  return KRW_FORMATTER.format(value);
}

/** 납기를 '영업일 기준 N일' 형식으로 표시 */
export function formatLeadTime(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "납기 협의";
  return `영업일 기준 ${days}일`;
}

/** power_kw 표시 (정수면 소수점 없이) */
export function formatPower(kw: number): string {
  if (!Number.isFinite(kw) || kw <= 0) return "—";
  return `${Number.isInteger(kw) ? kw : kw.toFixed(1)} kW`;
}

export interface StockBadgeStyle {
  label: StockStatus;
  /** Tailwind 클래스 (배경/글자/테두리) */
  className: string;
}

/** 재고 상태별 배지 스타일 구분 */
export function getStockBadge(status: StockStatus): StockBadgeStyle {
  switch (status) {
    case "재고 있음":
      return {
        label: status,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "주문 생산":
      return {
        label: status,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "입고 예정":
      return {
        label: status,
        className: "bg-sky-50 text-sky-700 border-sky-200",
      };
    default:
      return {
        label: status,
        className: "bg-brand-50 text-brand-600 border-brand-200",
      };
  }
}
