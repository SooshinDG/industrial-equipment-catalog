/**
 * open redirect 방지: 내부 절대경로(단일 슬래시 시작)만 허용한다.
 * 프로토콜-상대(//), 백슬래시(/\), 제어문자, 외부 URL 은 fallback 으로 대체.
 */
function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

export function sanitizeRedirect(
  target: string | null | undefined,
  fallback = "/admin/products",
): string {
  if (!target) return fallback;
  if (!target.startsWith("/")) return fallback;
  if (target.startsWith("//") || target.startsWith("/\\")) return fallback;
  if (hasControlChar(target)) return fallback;
  return target;
}
