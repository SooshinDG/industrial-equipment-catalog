/**
 * 관리자 이메일 허용 목록 — 순수 모듈(서버/미들웨어 공용, next/headers 미사용).
 * ADMIN_EMAILS 는 쉼표로 여러 이메일을 지원한다. 예) a@x.com,b@y.com
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
