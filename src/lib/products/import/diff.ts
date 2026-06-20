import { COLUMN_LABELS, COMPARABLE_COLUMNS } from "./columns";
import type {
  DiffEntry,
  FieldChange,
  ImportRecord,
  RowError,
} from "./types";

export interface ExistingProduct {
  product_id: string;
  slug: string;
  [key: string]: unknown;
}

function fieldToString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

/**
 * 검증 통과 레코드를 DB 현재 제품과 product_id 기준으로 비교한다.
 * - 신규 / 수정(+변경 필드) / 변경 없음 으로 분류
 * - created_at·updated_at 은 비교에서 제외
 * - 같은 slug 를 다른 product_id 가 이미 쓰는 경우 conflict(오류)로 분리
 */
export function computeDiff(
  records: { record: ImportRecord; row: number }[],
  existing: ExistingProduct[],
): { entries: DiffEntry[]; conflicts: RowError[] } {
  const byId = new Map(existing.map((e) => [e.product_id, e]));
  const slugOwner = new Map(existing.map((e) => [e.slug, e.product_id]));
  const entries: DiffEntry[] = [];
  const conflicts: RowError[] = [];

  for (const { record, row } of records) {
    const owner = slugOwner.get(record.slug);
    if (owner && owner !== record.product_id) {
      conflicts.push({
        row,
        column: "slug",
        code: "SLUG_CONFLICT",
        message: `slug '${record.slug}' 은(는) 다른 제품(${owner})이 이미 사용 중입니다.`,
      });
      continue;
    }

    const current = byId.get(record.product_id);
    if (!current) {
      entries.push({
        row,
        productId: record.product_id,
        slug: record.slug,
        productName: record.product_name,
        category: "created",
      });
      continue;
    }

    const changes: FieldChange[] = [];
    for (const col of COMPARABLE_COLUMNS) {
      if (!(col in record)) continue; // 파일에 없는 컬럼은 변경 대상 아님
      const after = fieldToString(
        (record as unknown as Record<string, unknown>)[col],
      );
      const before = fieldToString(current[col]);
      if (after !== before) {
        changes.push({ column: col, label: COLUMN_LABELS[col], before, after });
      }
    }

    entries.push({
      row,
      productId: record.product_id,
      slug: record.slug,
      productName: record.product_name,
      category: changes.length > 0 ? "updated" : "unchanged",
      changes: changes.length > 0 ? changes : undefined,
    });
  }

  return { entries, conflicts };
}
