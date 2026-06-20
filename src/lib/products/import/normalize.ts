import {
  BOOLEAN_FALSE_VALUES,
  BOOLEAN_TRUE_VALUES,
} from "./columns";
import type { RawRow } from "./types";

/** 헤더 정규화: 선행 BOM 제거 + 앞뒤 공백 제거 */
export function normalizeHeader(header: string): string {
  return header.replace(/^﻿/, "").trim();
}

/** 셀 값을 문자열로 정규화(앞뒤 공백 제거). xlsx가 number/boolean을 줄 수 있어 String() 처리 */
export function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/^﻿/, "").trim();
}

/** 완전히 빈 행인지 */
export function isBlankRow(row: RawRow): boolean {
  return Object.values(row).every((v) => normalizeCell(v) === "");
}

/** boolean 파싱 — 허용값 외에는 null */
export function parseBoolean(value: string): boolean | null {
  const v = value.trim().toLowerCase();
  if (BOOLEAN_TRUE_VALUES.includes(v)) return true;
  if (BOOLEAN_FALSE_VALUES.includes(v)) return false;
  return null;
}

/** 숫자 파싱 — 콤마/공백 허용. 빈 문자열은 null, 형식 오류는 NaN */
export function parseNumberCell(value: string): number | null {
  const v = value.trim();
  if (v === "") return null;
  const n = Number(v.replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}
