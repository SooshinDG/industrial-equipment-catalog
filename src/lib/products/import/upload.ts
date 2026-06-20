import "server-only";

import { MAX_FILE_SIZE_BYTES } from "./columns";
import { parseSpreadsheet } from "./parse";
import { buildPreview } from "./preview";
import { fetchAllProductsForDiff } from "../admin-store";
import type { ImportRecord, PreviewResult } from "./types";

export type UploadOutcome =
  | { ok: true; preview: PreviewResult; records: ImportRecord[] }
  | { ok: false; status: number; error: string };

/**
 * 멀티파트 업로드를 읽어 서버에서 다시 파싱·검증·diff 한다(클라이언트 수치 불신).
 * 파일 크기/존재 가드 후 buildPreview 로 동일 로직 계산.
 */
export async function processUpload(request: Request): Promise<UploadOutcome> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, status: 400, error: "업로드 형식이 올바르지 않습니다." };
  }

  const file = form.get("file");
  const sheet = form.get("sheet");

  if (!(file instanceof File)) {
    return { ok: false, status: 400, error: "파일이 없습니다." };
  }
  if (file.size === 0) {
    return { ok: false, status: 400, error: "빈 파일입니다." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, status: 400, error: "파일이 너무 큽니다. 최대 5MB까지 지원합니다." };
  }

  const buffer = await file.arrayBuffer();
  const parsed = parseSpreadsheet(
    buffer,
    typeof sheet === "string" && sheet ? sheet : undefined,
  );
  const existing = await fetchAllProductsForDiff();
  const { preview, records } = buildPreview(parsed, existing, {
    name: file.name,
    size: file.size,
  });
  return { ok: true, preview, records };
}
