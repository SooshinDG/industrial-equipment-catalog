import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { applyProductImport } from "@/lib/products/admin-store";
import { processUpload } from "@/lib/products/import/upload";
import { revalidateProductCatalog } from "@/lib/products/revalidate";

export const runtime = "nodejs";

/**
 * 최종 반영 — 서버에서 다시 검증·diff 후, 오류가 0일 때만 원자적 bulk upsert.
 * 성공 시 공개 카탈로그 캐시를 무효화한다.
 */
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json(
      { error: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const outcome = await processUpload(request);
    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    }

    // 서버 재검증에서 오류가 하나라도 있으면 일부도 반영하지 않고 전체 실패
    if (!outcome.preview.ok) {
      return NextResponse.json(
        {
          error: "검증 오류가 있어 반영할 수 없습니다.",
          preview: outcome.preview,
        },
        { status: 400 },
      );
    }

    const applied = await applyProductImport(outcome.records);

    // 신규 slug 가 재배포 없이 열리도록 공개 경로 캐시 무효화
    revalidateProductCatalog();

    return NextResponse.json({
      result: {
        ok: true,
        counts: outcome.preview.counts,
        applied,
        message: `반영 완료 — 신규 ${outcome.preview.counts.created} · 수정 ${outcome.preview.counts.updated} · 변경 없음 ${outcome.preview.counts.unchanged}`,
      },
      preview: outcome.preview,
    });
  } catch {
    return NextResponse.json(
      { error: "반영 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
