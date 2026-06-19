/**
 * 의존성 없는 최소 CSV 파서.
 * - RFC 4180 스타일 따옴표 필드(콤마/개행/이스케이프된 따옴표 포함) 지원
 * - 선행 BOM 제거
 * - CRLF / LF 모두 처리
 */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++; // 이스케이프된 따옴표
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // CRLF의 \r은 무시 (다음 \n에서 행 종료)
      continue;
    } else {
      field += char;
    }
  }

  // 마지막 필드/행 처리 (파일 끝에 개행이 없는 경우)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/** 헤더 행을 키로 사용해 객체 배열로 변환 */
export function parseCsvToRecords(input: string): Record<string, string>[] {
  const rows = parseCsv(input).filter(
    (r) => r.length > 0 && r.some((cell) => cell.trim() !== ""),
  );
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, idx) => {
      record[header] = (cells[idx] ?? "").trim();
    });
    return record;
  });
}
