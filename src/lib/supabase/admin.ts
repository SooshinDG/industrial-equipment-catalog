import "server-only";

import { createClient } from "@supabase/supabase-js";
import { requireSecretSupabaseEnv } from "./config";

/**
 * 서버 관리자 작업 전용 Supabase 클라이언트 (service-role/secret 키).
 * RLS를 우회하므로 신뢰된 서버 컨텍스트(인증을 마친 Route Handler, 시드 스크립트)에서만 사용한다.
 *
 * 주의: 이 모듈은 "server-only"로 보호되어 브라우저 번들에 포함되면 빌드가 실패한다.
 * secret 키는 절대 NEXT_PUBLIC_ 으로 노출하거나 클라이언트 컴포넌트에서 import 하면 안 된다.
 */
export function createSupabaseAdminClient() {
  const { url, key } = requireSecretSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
