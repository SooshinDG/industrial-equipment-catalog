/** 재고 상태 — CSV stock_status 값과 일치 */
export type StockStatus = "재고 있음" | "주문 생산" | "입고 예정";

export const STOCK_STATUSES: StockStatus[] = [
  "재고 있음",
  "주문 생산",
  "입고 예정",
];

/**
 * CSV 한 행을 타입 안전하게 변환한 제품 모델.
 * 숫자/boolean은 파싱 단계에서 올바른 타입으로 변환한다.
 */
export interface Product {
  productId: string;
  slug: string;
  productName: string;
  category: string;
  manufacturer: string;
  model: string;
  useCase: string;
  mainSpecLabel: string;
  mainSpecValue: string;
  subSpecLabel: string;
  subSpecValue: string;
  voltage: string;
  powerKw: number;
  priceKrw: number;
  leadTimeDays: number;
  stockStatus: StockStatus;
  certification: string;
  featured: boolean;
  summary: string;
}

/** CSV 컬럼명 → 타입 매핑 참고용 (README와 동기화) */
export const CSV_COLUMNS = [
  "product_id",
  "slug",
  "product_name",
  "category",
  "manufacturer",
  "model",
  "use_case",
  "main_spec_label",
  "main_spec_value",
  "sub_spec_label",
  "sub_spec_value",
  "voltage",
  "power_kw",
  "price_krw",
  "lead_time_days",
  "stock_status",
  "certification",
  "featured",
  "summary",
] as const;
