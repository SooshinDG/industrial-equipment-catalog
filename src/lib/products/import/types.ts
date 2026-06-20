import type { ImportColumn } from "./columns";

/** 헤더→셀(문자열) 한 행 */
export type RawRow = Record<string, string>;

/** 검증을 통과한 DB 반영용 레코드 (파일에 존재하는 컬럼 + product_id, snake_case) */
export interface ImportRecord {
  product_id: string;
  slug: string;
  product_name: string;
  category: string;
  manufacturer: string;
  model: string;
  price_krw: number;
  stock_status: string;
  use_case?: string | null;
  main_spec_label?: string | null;
  main_spec_value?: string | null;
  sub_spec_label?: string | null;
  sub_spec_value?: string | null;
  voltage?: string | null;
  power_kw?: number | null;
  lead_time_days?: number | null;
  certification?: string | null;
  featured?: boolean;
  summary?: string | null;
  is_active?: boolean;
}

/** 행 단위 오류 (1-based 데이터 행 번호) */
export interface RowError {
  row: number;
  column?: ImportColumn | string;
  code: string;
  message: string;
}

export interface ParsedFile {
  sheetNames: string[];
  sheet: string;
  headers: string[];
  recognizedColumns: ImportColumn[];
  unknownColumns: string[];
  rawRows: RawRow[];
  /** 빈 행 제외 전 전체 데이터 행 수 */
  totalRows: number;
}

export interface ValidationResult {
  /** rawRows 인덱스와 무관하게, 검증 통과 레코드와 그 원본 행번호 */
  records: { record: ImportRecord; row: number }[];
  errors: RowError[];
}

export type DiffCategory = "created" | "updated" | "unchanged";

export interface FieldChange {
  column: string;
  label: string;
  before: string;
  after: string;
}

export interface DiffEntry {
  row: number;
  productId: string;
  slug: string;
  productName: string;
  category: DiffCategory;
  changes?: FieldChange[];
}

export interface PreviewCounts {
  total: number;
  valid: number;
  created: number;
  updated: number;
  unchanged: number;
  error: number;
  /** 파일에서 is_active=false 로 비공개 처리될 행 수 (반영 직전 안내용) */
  deactivating: number;
}

export interface PreviewResult {
  file: {
    name: string;
    size: number;
    sheet: string;
    sheetNames: string[];
  };
  counts: PreviewCounts;
  /** 최대 PREVIEW_ROW_LIMIT 개 */
  rows: DiffEntry[];
  errors: RowError[];
  /** 오류가 0개일 때만 true → 최종 반영 가능 */
  ok: boolean;
}

export interface ImportResult {
  ok: boolean;
  counts: PreviewCounts;
  applied: number;
  message: string;
}
