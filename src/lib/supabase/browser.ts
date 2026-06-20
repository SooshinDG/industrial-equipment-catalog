"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseEnv } from "./config";

/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트.
 * 공개(publishable/anon) 키만 사용한다 — secret 키는 절대 들어가지 않는다.
 * (향후 관리자 로그인 UI에서 사용 예정)
 */
export function createSupabaseBrowserClient() {
  const { url, key } = requirePublicSupabaseEnv();
  return createBrowserClient(url, key);
}
