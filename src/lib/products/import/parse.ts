import * as XLSX from "xlsx";
import { ALL_COLUMNS, type ImportColumn } from "./columns";
import { isBlankRow, normalizeCell, normalizeHeader } from "./normalize";
import type { ParsedFile, RawRow } from "./types";

const ALL_COLUMN_SET = new Set<string>(ALL_COLUMNS);

/**
 * 입력을 워크북으로 읽는다.
 * - .xlsx(zip, "PK") / .xls(OLE, 0xD0CF) 는 바이너리로 읽고
 * - 그 외(텍스트 CSV)는 UTF-8 문자열로 디코딩해 읽는다.
 *   (xlsx 의 array 모드는 CSV 바이트를 UTF-8 로 디코딩하지 않아 한글이 깨지므로
 *    CSV 는 명시적으로 UTF-8 디코딩 후 type:"string" 으로 전달)
 */
function readWorkbook(data: ArrayBuffer): XLSX.WorkBook {
  const bytes = new Uint8Array(data);
  const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b; // PK (xlsx)
  const isOle = bytes[0] === 0xd0 && bytes[1] === 0xcf; // 구형 .xls
  if (isZip || isOle) {
    return XLSX.read(data, { type: "array" });
  }
  const text = new TextDecoder("utf-8").decode(bytes).replace(/^﻿/, "");
  return XLSX.read(text, { type: "string" });
}

/** 워크북에서 시트명 목록만 얻는다 (시트 선택 UI용) */
export function listSheetNames(data: ArrayBuffer): string[] {
  return readWorkbook(data).SheetNames;
}

/**
 * .xlsx/.xls/.csv 를 동일 경로로 파싱한다(SheetJS).
 * 첫 행을 헤더로 사용하고, 헤더/셀을 정규화한다(BOM·공백 제거).
 * 인식된 컬럼만 rawRows 에 담는다.
 */
export function parseSpreadsheet(
  data: ArrayBuffer,
  sheetName?: string,
): ParsedFile {
  const wb = readWorkbook(data);
  const sheetNames = wb.SheetNames;
  const sheet =
    sheetName && sheetNames.includes(sheetName) ? sheetName : sheetNames[0];

  const empty: ParsedFile = {
    sheetNames,
    sheet: sheet ?? "",
    headers: [],
    recognizedColumns: [],
    unknownColumns: [],
    rawRows: [],
    totalRows: 0,
  };
  if (!sheet) return empty;

  const ws = wb.Sheets[sheet];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(ws, {
    header: 1,
    raw: false,
    defval: "",
  });
  if (matrix.length === 0) return empty;

  const headers = (matrix[0] as unknown[]).map((h) =>
    normalizeHeader(normalizeCell(h)),
  );
  const recognizedColumns = headers.filter(
    (h): h is ImportColumn => ALL_COLUMN_SET.has(h),
  );
  const unknownColumns = headers.filter(
    (h) => h !== "" && !ALL_COLUMN_SET.has(h),
  );

  const rawRows: RawRow[] = (matrix.slice(1) as unknown[][]).map((cells) => {
    const row: RawRow = {};
    headers.forEach((h, i) => {
      if (h && ALL_COLUMN_SET.has(h)) row[h] = normalizeCell(cells[i]);
    });
    return row;
  });

  const totalRows = rawRows.filter((r) => !isBlankRow(r)).length;

  return {
    sheetNames,
    sheet,
    headers,
    recognizedColumns,
    unknownColumns,
    rawRows,
    totalRows,
  };
}
