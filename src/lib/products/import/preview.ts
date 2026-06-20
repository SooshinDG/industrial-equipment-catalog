import { PREVIEW_ROW_LIMIT } from "./columns";
import { computeDiff, type ExistingProduct } from "./diff";
import { validateRows } from "./validate";
import type {
  ImportRecord,
  ParsedFile,
  PreviewResult,
  RowError,
} from "./types";

/**
 * 파싱된 파일 + DB 현재 제품으로 미리보기 결과를 만든다.
 * preview/import 두 엔드포인트가 동일 로직으로 계산하도록 공유한다(서버 권위).
 * 반환에는 반영용 records(검증·충돌 통과분)도 포함한다.
 */
export function buildPreview(
  parsed: ParsedFile,
  existing: ExistingProduct[],
  fileMeta: { name: string; size: number },
): { preview: PreviewResult; records: ImportRecord[] } {
  const { records: validRecords, errors: validationErrors } = validateRows(parsed);
  const { entries, conflicts } = computeDiff(validRecords, existing);

  const errors: RowError[] = [...validationErrors, ...conflicts];
  // 충돌난 행은 반영 대상에서 제외
  const conflictRows = new Set(conflicts.map((c) => c.row));
  const applicableRecords = validRecords
    .filter((r) => !conflictRows.has(r.row))
    .map((r) => r.record);

  const created = entries.filter((e) => e.category === "created").length;
  const updated = entries.filter((e) => e.category === "updated").length;
  const unchanged = entries.filter((e) => e.category === "unchanged").length;
  const deactivating = applicableRecords.filter(
    (r) => r.is_active === false,
  ).length;

  const preview: PreviewResult = {
    file: {
      name: fileMeta.name,
      size: fileMeta.size,
      sheet: parsed.sheet,
      sheetNames: parsed.sheetNames,
    },
    counts: {
      total: parsed.totalRows,
      valid: entries.length,
      created,
      updated,
      unchanged,
      error: errors.length,
      deactivating,
    },
    rows: entries.slice(0, PREVIEW_ROW_LIMIT),
    errors,
    ok: errors.length === 0,
  };

  return { preview, records: applicableRecords };
}
