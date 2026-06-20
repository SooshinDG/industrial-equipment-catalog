import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "./allowlist";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * 서버에서 Supabase Auth 세션을 검증(getUser — 토큰을 Supabase 에 확인)하고
 * ADMIN_EMAILS 허용 목록을 다시 확인한다. 관리자 페이지/관리자 API 의 권위 있는 게이트.
 * 클라이언트 UI 판단에 의존하지 않는다.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email || !isAdminEmail(user.email)) return null;
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}
