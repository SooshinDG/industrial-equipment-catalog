"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AlertTriangle, FileSpreadsheet, UploadCloud } from "lucide-react";
import {
  MAX_DATA_ROWS,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/products/import/columns";
import { parseSpreadsheet } from "@/lib/products/import/parse";
import { validateRows } from "@/lib/products/import/validate";
import type {
  DiffEntry,
  PreviewResult,
  RowError,
} from "@/lib/products/import/types";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const CATEGORY_LABEL: Record<DiffEntry["category"], string> = {
  created: "신규",
  updated: "수정",
  unchanged: "변경 없음",
};
const CATEGORY_DOT: Record<DiffEntry["category"], string> = {
  created: "bg-emerald-500",
  updated: "bg-accent-500",
  unchanged: "bg-brand-300",
};

export function AdminUploader({
  counts,
}: {
  counts: { total: number; active: number };
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheet, setSheet] = useState<string>("");
  const [clientErrorCount, setClientErrorCount] = useState<number | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const reset = (clearInput = true) => {
    setPreview(null);
    setError(null);
    setAck(false);
    setDone(null);
    setClientErrorCount(null);
    if (clearInput && inputRef.current) inputRef.current.value = "";
  };

  // 브라우저 1차 분석: 시트 목록 + 즉시 유효성 검사(검증 모듈 공유)
  const analyzeClient = async (f: File, sheetName?: string) => {
    const buf = await f.arrayBuffer();
    const parsed = parseSpreadsheet(buf, sheetName);
    setSheetNames(parsed.sheetNames);
    setSheet(parsed.sheet);
    const { errors } = validateRows(parsed);
    setClientErrorCount(errors.length);
  };

  const onSelectFile = async (f: File | null) => {
    reset(false);
    setFile(f);
    setSheetNames([]);
    setSheet("");
    setClientErrorCount(null);
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_BYTES) {
      setError("파일이 너무 큽니다. 최대 5MB까지 지원합니다.");
      return;
    }
    try {
      await analyzeClient(f);
    } catch {
      setError("파일을 읽을 수 없습니다. .xlsx, .xls, .csv 형식인지 확인하세요.");
    }
  };

  const onChangeSheet = async (next: string) => {
    setSheet(next);
    setPreview(null);
    setAck(false);
    setDone(null);
    if (file) {
      try {
        await analyzeClient(file, next);
      } catch {
        /* 무시 */
      }
    }
  };

  // 서버 분석(권위): 파싱·검증·diff 재계산
  const runServerPreview = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setPreview(null);
    setDone(null);
    setAck(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (sheet) fd.append("sheet", sheet);
      const res = await fetch("/api/admin/products/preview", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "파일 분석에 실패했습니다.");
        return;
      }
      setPreview(json.preview as PreviewResult);
    } catch {
      setError("서버 분석 중 네트워크 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const runImport = async () => {
    if (!file || !preview?.ok || !ack || importing) return; // 중복 제출 방지
    setImporting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (sheet) fd.append("sheet", sheet);
      const res = await fetch("/api/admin/products/import", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "반영에 실패했습니다.");
        if (json.preview) setPreview(json.preview as PreviewResult);
        return;
      }
      setDone(json.result?.message ?? "반영이 완료되었습니다.");
      setPreview(null);
      setAck(false);
      router.refresh(); // 상단 제품 수 갱신
    } catch {
      setError("반영 중 네트워크 오류가 발생했습니다.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 현재 데이터 상태 */}
      <section className="rounded-sm border border-brand-200 bg-white p-5">
        <p className="eyebrow">현재 데이터 상태</p>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Stat label="활성 제품" value={counts.active} />
          <Stat label="전체 제품" value={counts.total} />
          <div>
            <dt className="text-xs text-brand-400">데이터 출처</dt>
            <dd className="num mt-0.5 text-sm font-semibold text-brand-800">
              Supabase
            </dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-brand-100 pt-3 text-xs text-brand-400">
          포트폴리오 데모 데이터입니다. 대량 반영 전에는 Supabase에서 백업(테이블
          내보내기)을 권장합니다.
        </p>
      </section>

      {/* 1) 업로드 영역 */}
      <section className="rounded-sm border border-brand-200 bg-white p-5">
        <p className="eyebrow">파일 업로드</p>
        <label
          htmlFor="admin-file"
          className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-brand-300 bg-brand-50 px-4 py-8 text-center hover:border-brand-400"
        >
          <UploadCloud className="h-7 w-7 text-brand-400" aria-hidden="true" />
          <span className="text-sm font-medium text-brand-700">
            .xlsx · .xls · .csv 파일 선택
          </span>
          <span className="text-xs text-brand-400">
            최대 5MB · 최대 {MAX_DATA_ROWS.toLocaleString()}행 · 첫 행은 컬럼명
          </span>
          <input
            ref={inputRef}
            id="admin-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {file && (
          <div className="mt-4 flex flex-col gap-3 border-t border-brand-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-brand-800">
                <FileSpreadsheet className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="truncate">{file.name}</span>
              </p>
              <p className="num mt-1 text-xs text-brand-400">
                {formatBytes(file.size)}
                {clientErrorCount !== null && (
                  <span className="ml-2 text-brand-500">
                    · 1차 검사 오류 {clientErrorCount}건
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-end gap-3">
              {sheetNames.length > 1 && (
                <div>
                  <label htmlFor="admin-sheet" className="field-label">
                    시트 선택
                  </label>
                  <select
                    id="admin-sheet"
                    value={sheet}
                    onChange={(e) => onChangeSheet(e.target.value)}
                    className="field-input"
                  >
                    {sheetNames.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button
                type="button"
                onClick={runServerPreview}
                disabled={analyzing}
                className="btn-primary"
              >
                {analyzing ? "분석 중…" : "파일 분석"}
              </button>
            </div>
          </div>
        )}
      </section>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {done && (
        <p
          role="status"
          className="rounded-sm border border-brand-200 border-l-4 border-l-emerald-500 bg-white px-4 py-3 text-sm font-medium text-brand-900"
        >
          {done}
        </p>
      )}

      {/* 2) 미리보기 */}
      {preview && <PreviewPanel preview={preview} />}

      {/* 3) 확인 + 반영 */}
      {preview && (
        <section className="rounded-sm border border-brand-200 bg-white p-5">
          <p className="eyebrow">반영 확인</p>
          {preview.ok ? (
            <>
              <p className="mt-2 text-sm text-brand-600">
                신규{" "}
                <span className="num font-semibold text-brand-900">
                  {preview.counts.created}
                </span>
                건 · 수정{" "}
                <span className="num font-semibold text-brand-900">
                  {preview.counts.updated}
                </span>
                건 · 비공개 예정{" "}
                <span className="num font-semibold text-brand-900">
                  {preview.counts.deactivating}
                </span>
                건을 반영합니다.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-brand-500">
                <li>· 파일에 없는 기존 제품은 삭제되지 않고 그대로 유지됩니다.</li>
                <li>· 삭제 대신 is_active=false 인 행만 비공개로 처리됩니다.</li>
                <li>· product_id 기준 upsert 로 전체가 원자적으로 반영됩니다.</li>
              </ul>
              <label className="mt-4 flex items-start gap-2 text-sm text-brand-700">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="mt-0.5 h-4 w-4"
                />
                <span>
                  반영 내용을 확인했으며, 필요 시 백업을 마쳤습니다.
                </span>
              </label>
              <button
                type="button"
                onClick={runImport}
                disabled={!ack || importing}
                className="btn-primary mt-4"
              >
                {importing ? "반영 중…" : "Supabase에 반영"}
              </button>
            </>
          ) : (
            <p className="mt-2 flex items-center gap-2 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              오류 {preview.counts.error}건이 있어 반영할 수 없습니다. 오류를
              수정한 뒤 다시 분석하세요.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-brand-400">{label}</dt>
      <dd className="num mt-0.5 text-xl font-bold text-brand-900">{value}</dd>
    </div>
  );
}

function PreviewPanel({ preview }: { preview: PreviewResult }) {
  return (
    <section className="rounded-sm border border-brand-200 bg-white p-5">
      <p className="eyebrow">분석 결과</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Count label="전체 행" value={preview.counts.total} />
        <Count label="정상" value={preview.counts.valid} />
        <Count label="신규" value={preview.counts.created} />
        <Count label="수정" value={preview.counts.updated} />
        <Count label="변경 없음" value={preview.counts.unchanged} />
        <Count label="오류" value={preview.counts.error} alert={preview.counts.error > 0} />
      </dl>
      <p className="num mt-2 text-xs text-brand-400">
        {preview.file.name} · 시트 {preview.file.sheet} ·{" "}
        {formatBytes(preview.file.size)}
      </p>

      {/* 오류 목록 */}
      {preview.errors.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-red-700">
            오류 ({preview.errors.length})
          </p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {preview.errors.slice(0, 100).map((e: RowError, i) => (
              <li key={i}>
                {e.row > 0 ? `행 ${e.row}` : "파일"}
                {e.column ? ` · ${e.column}` : ""}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 데이터 미리보기 (최대 100행) */}
      {preview.rows.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-sm border border-brand-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-50 text-brand-500">
              <tr>
                <th className="px-3 py-2 font-medium">행</th>
                <th className="px-3 py-2 font-medium">구분</th>
                <th className="px-3 py-2 font-medium">제품</th>
                <th className="px-3 py-2 font-medium">변경 내용</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((entry) => (
                <tr key={entry.productId} className="border-t border-brand-100 align-top">
                  <td className="num px-3 py-2 text-brand-400">{entry.row}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-brand-700">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[entry.category]}`}
                      />
                      {CATEGORY_LABEL[entry.category]}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-brand-900">{entry.productName}</p>
                    <p className="num text-[11px] text-brand-400">{entry.productId}</p>
                  </td>
                  <td className="px-3 py-2">
                    {entry.changes && entry.changes.length > 0 ? (
                      <ul className="space-y-0.5">
                        {entry.changes.map((c) => (
                          <li key={c.column} className="text-brand-600">
                            <span className="text-brand-400">{c.label}</span>{" "}
                            <span className="num">{c.before || "—"}</span>
                            <span className="mx-1 text-brand-300">→</span>
                            <span className="num font-medium text-brand-900">
                              {c.after || "—"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-brand-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Count({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: number;
  alert?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] text-brand-400">{label}</dt>
      <dd
        className={`num mt-0.5 text-lg font-bold ${alert ? "text-red-600" : "text-brand-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}
