import {
  ALLOWED_STOCK_STATUSES,
  MAX_DATA_ROWS,
  REQUIRED_COLUMNS,
} from "./columns";
import { isBlankRow, parseBoolean, parseNumberCell } from "./normalize";
import type { ImportRecord, ParsedFile, RowError, ValidationResult } from "./types";

const REQUIRED_VALUE_COLUMNS = REQUIRED_COLUMNS;

/**
 * 파싱된 파일을 행 단위로 검증한다 (DB 비의존 — 클라이언트·서버 공용).
 * 빈 행은 제외하고, 형식/필수/중복/범위 오류를 행번호와 함께 모은다.
 * DB 충돌(다른 product_id 가 쓰는 slug 등)은 서버 diff 단계에서 별도 검사한다.
 */
export function validateRows(parsed: ParsedFile): ValidationResult {
  const errors: RowError[] = [];

  // 1) 필수 컬럼 존재
  const missingCols = REQUIRED_COLUMNS.filter(
    (c) => !parsed.recognizedColumns.includes(c),
  );
  if (missingCols.length > 0) {
    for (const col of missingCols) {
      errors.push({
        row: 0,
        column: col,
        code: "MISSING_COLUMN",
        message: `필수 컬럼 '${col}' 이(가) 없습니다.`,
      });
    }
    return { records: [], errors };
  }

  // 2) 최대 행 수
  if (parsed.totalRows > MAX_DATA_ROWS) {
    errors.push({
      row: 0,
      code: "TOO_MANY_ROWS",
      message: `데이터 행이 ${parsed.totalRows}개로 최대 ${MAX_DATA_ROWS}개를 초과합니다.`,
    });
    return { records: [], errors };
  }

  const records: { record: ImportRecord; row: number }[] = [];
  const seenProductIds = new Map<string, number>();
  const seenSlugs = new Map<string, number>();

  parsed.rawRows.forEach((raw, idx) => {
    const row = idx + 1; // 1-based 데이터 행
    if (isBlankRow(raw)) return; // 완전히 빈 행 제외

    const rowErrors: RowError[] = [];

    // 필수값
    for (const col of REQUIRED_VALUE_COLUMNS) {
      if (!raw[col] || raw[col].trim() === "") {
        rowErrors.push({
          row,
          column: col,
          code: "MISSING_VALUE",
          message: `'${col}' 값이 비어 있습니다.`,
        });
      }
    }

    // 가격 (정수 ≥ 0)
    const price = parseNumberCell(raw.price_krw ?? "");
    if (raw.price_krw && Number.isNaN(price)) {
      rowErrors.push({ row, column: "price_krw", code: "INVALID_NUMBER", message: "가격이 숫자가 아닙니다." });
    } else if (price !== null && !Number.isNaN(price)) {
      if (price < 0) rowErrors.push({ row, column: "price_krw", code: "NEGATIVE_PRICE", message: "가격은 음수일 수 없습니다." });
      else if (!Number.isInteger(price)) rowErrors.push({ row, column: "price_krw", code: "INVALID_NUMBER", message: "가격은 정수여야 합니다." });
    }

    // 납기 (정수 ≥ 0, 선택)
    const lead = parseNumberCell(raw.lead_time_days ?? "");
    if (raw.lead_time_days && Number.isNaN(lead)) {
      rowErrors.push({ row, column: "lead_time_days", code: "INVALID_NUMBER", message: "납기가 숫자가 아닙니다." });
    } else if (lead !== null && !Number.isNaN(lead)) {
      if (lead < 0) rowErrors.push({ row, column: "lead_time_days", code: "NEGATIVE_LEAD", message: "납기는 음수일 수 없습니다." });
      else if (!Number.isInteger(lead)) rowErrors.push({ row, column: "lead_time_days", code: "INVALID_NUMBER", message: "납기는 정수여야 합니다." });
    }

    // 정격 출력 (≥ 0, 소수 허용, 선택)
    const power = parseNumberCell(raw.power_kw ?? "");
    if (raw.power_kw && Number.isNaN(power)) {
      rowErrors.push({ row, column: "power_kw", code: "INVALID_NUMBER", message: "정격 출력이 숫자가 아닙니다." });
    } else if (power !== null && !Number.isNaN(power) && power < 0) {
      rowErrors.push({ row, column: "power_kw", code: "NEGATIVE_POWER", message: "정격 출력은 음수일 수 없습니다." });
    }

    // 재고 상태
    if (raw.stock_status && !ALLOWED_STOCK_STATUSES.includes(raw.stock_status as (typeof ALLOWED_STOCK_STATUSES)[number])) {
      rowErrors.push({
        row,
        column: "stock_status",
        code: "INVALID_STOCK",
        message: `허용되지 않는 재고 상태 '${raw.stock_status}'. 허용: ${ALLOWED_STOCK_STATUSES.join(", ")}`,
      });
    }

    // boolean (선택)
    const featured = "featured" in raw && raw.featured !== "" ? parseBoolean(raw.featured) : undefined;
    if ("featured" in raw && raw.featured !== "" && featured === null) {
      rowErrors.push({ row, column: "featured", code: "INVALID_BOOLEAN", message: "추천(featured) 값이 boolean 형식이 아닙니다." });
    }
    const isActive = "is_active" in raw && raw.is_active !== "" ? parseBoolean(raw.is_active) : undefined;
    if ("is_active" in raw && raw.is_active !== "" && isActive === null) {
      rowErrors.push({ row, column: "is_active", code: "INVALID_BOOLEAN", message: "공개 여부(is_active) 값이 boolean 형식이 아닙니다." });
    }

    // 파일 내 중복
    if (raw.product_id) {
      if (seenProductIds.has(raw.product_id)) {
        rowErrors.push({ row, column: "product_id", code: "DUPLICATE_PRODUCT_ID", message: `파일 내 product_id 중복 (행 ${seenProductIds.get(raw.product_id)} 와 동일)` });
      } else {
        seenProductIds.set(raw.product_id, row);
      }
    }
    if (raw.slug) {
      if (seenSlugs.has(raw.slug)) {
        rowErrors.push({ row, column: "slug", code: "DUPLICATE_SLUG", message: `파일 내 slug 중복 (행 ${seenSlugs.get(raw.slug)} 와 동일)` });
      } else {
        seenSlugs.set(raw.slug, row);
      }
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      return;
    }

    // 검증 통과 → 반영 레코드(파일에 존재하는 컬럼만) 구성
    const record: ImportRecord = {
      product_id: raw.product_id,
      slug: raw.slug,
      product_name: raw.product_name,
      category: raw.category,
      manufacturer: raw.manufacturer,
      model: raw.model,
      price_krw: price as number,
      stock_status: raw.stock_status,
    };
    const setText = (col: keyof ImportRecord) => {
      if (col in raw)
        (record as unknown as Record<string, unknown>)[col] =
          raw[col] === "" ? null : raw[col];
    };
    setText("use_case");
    setText("main_spec_label");
    setText("main_spec_value");
    setText("sub_spec_label");
    setText("sub_spec_value");
    setText("voltage");
    setText("certification");
    setText("summary");
    if ("power_kw" in raw) record.power_kw = power === null || Number.isNaN(power) ? null : power;
    if ("lead_time_days" in raw) record.lead_time_days = lead === null || Number.isNaN(lead) ? null : lead;
    if (typeof featured === "boolean") record.featured = featured;
    if (typeof isActive === "boolean") record.is_active = isActive;

    records.push({ record, row });
  });

  return { records, errors };
}
