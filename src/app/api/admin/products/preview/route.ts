import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { processUpload } from "@/lib/products/import/upload";

// xlsx 파싱 + service-role 클라이언트 → Node.js 런타임
export const runtime = "nodejs";

/** 파일 미리보기 — 서버에서 다시 분석·검증·diff (반영 없음) */
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
    return NextResponse.json({ preview: outcome.preview });
  } catch {
    // 내부 오류 스택/민감정보를 노출하지 않는다
    return NextResponse.json(
      { error: "파일 분석 중 오류가 발생했습니다." },
      { status: 400 },
    );
  }
}
