import { STOCK_STATUSES } from "@/lib/types";

/**
 * 스프레드시트 업로드의 컬럼 규칙 — 클라이언트·서버 공용 단일 출처.
 * products 테이블/CSV 의 컬럼명을 기준으로 한다.
 */

export const REQUIRED_COLUMNS = [
  "product_id",
  "slug",
  "product_name",
  "category",
  "manufacturer",
  "model",
  "price_krw",
  "stock_status",
] as const;

export const OPTIONAL_COLUMNS = [
  "use_case",
  "main_spec_label",
  "main_spec_value",
  "sub_spec_label",
  "sub_spec_value",
  "voltage",
  "power_kw",
  "lead_time_days",
  "certification",
  "featured",
  "summary",
  "is_active",
] as const;

export const ALL_COLUMNS = [
  ...REQUIRED_COLUMNS,
  ...OPTIONAL_COLUMNS,
] as const;

export type ImportColumn = (typeof ALL_COLUMNS)[number];

/** product_id, created_at, updated_at 은 비교/표시에서 제외하거나 별도 처리 */
export const COMPARABLE_COLUMNS = ALL_COLUMNS.filter(
  (c) => c !== "product_id",
) as Exclude<ImportColumn, "product_id">[];

/** 숫자 컬럼 */
export const NUMERIC_COLUMNS = ["power_kw", "price_krw", "lead_time_days"] as const;
/** boolean 컬럼 */
export const BOOLEAN_COLUMNS = ["featured", "is_active"] as const;

/** 허용 재고 상태 — 프로젝트에서 실제 사용하는 값만 (types.ts 단일 출처) */
export const ALLOWED_STOCK_STATUSES = STOCK_STATUSES;

/** boolean 허용 표기 (소문자 비교) */
export const BOOLEAN_TRUE_VALUES = ["true", "1", "yes", "예", "y"];
export const BOOLEAN_FALSE_VALUES = ["false", "0", "no", "아니오", "n"];

/** 파일/행 제한 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_DATA_ROWS = 3000;
export const PREVIEW_ROW_LIMIT = 100;

/** 표시용 한국어 라벨 */
export const COLUMN_LABELS: Record<ImportColumn, string> = {
  product_id: "제품 ID",
  slug: "slug",
  product_name: "제품명",
  category: "카테고리",
  manufacturer: "제조사",
  model: "모델",
  use_case: "용도",
  main_spec_label: "주요 사양 라벨",
  main_spec_value: "주요 사양 값",
  sub_spec_label: "보조 사양 라벨",
  sub_spec_value: "보조 사양 값",
  voltage: "전압",
  power_kw: "정격 출력(kW)",
  price_krw: "가격(원)",
  lead_time_days: "납기(일)",
  stock_status: "재고 상태",
  certification: "인증",
  featured: "추천",
  summary: "요약",
  is_active: "공개 여부",
};
