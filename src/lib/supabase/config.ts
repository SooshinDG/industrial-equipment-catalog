/**
 * Supabase 환경변수 접근 헬퍼.
 * - 신규 키명(PUBLISHABLE / SECRET)과 구형 키명(ANON / SERVICE_ROLE)을 모두 지원
 * - 공개 키만 NEXT_PUBLIC_* 로 노출하고, secret 키는 절대 NEXT_PUBLIC_* 가 아님
 * - 누락 시 개발자가 이해하기 쉬운 오류 메시지를 던진다
 */

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined;
}

/** 브라우저에 노출 가능한 공개(anon/publishable) 키 */
export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    undefined
  );
}

/** 서버 전용 secret(service-role) 키 — 절대 브라우저로 보내지 않는다 */
export function getSupabaseSecretKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    undefined
  );
}

export function requirePublicSupabaseEnv(): { url: string; key: string } {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    throw new Error(
      "[supabase] 공개 환경변수가 설정되지 않았습니다. " +
        "NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" +
        "(구형 프로젝트는 NEXT_PUBLIC_SUPABASE_ANON_KEY)를 .env.local 또는 배포 환경변수에 설정하세요.",
    );
  }
  return { url, key };
}

export function requireSecretSupabaseEnv(): { url: string; key: string } {
  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();
  if (!url || !key) {
    throw new Error(
      "[supabase] 서버 전용 환경변수가 설정되지 않았습니다. " +
        "NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SECRET_KEY" +
        "(구형 프로젝트는 SUPABASE_SERVICE_ROLE_KEY)를 서버 환경변수에 설정하세요. " +
        "이 키는 절대 NEXT_PUBLIC_ 접두사로 노출하면 안 됩니다.",
    );
  }
  return { url, key };
}
