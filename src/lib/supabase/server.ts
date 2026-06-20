import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { requirePublicSupabaseEnv } from "./config";

/**
 * 서버 요청용(쿠키 연동) Supabase 클라이언트.
 * 로그인 세션을 쿠키로 읽고/쓰며, 향후 인증이 필요한 Route Handler·Server Action에서 사용한다.
 * 공개 키만 사용하므로 RLS 정책이 그대로 적용된다.
 */
export async function createSupabaseServerClient() {
  const { url, key } = requirePublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // RSC 등 쿠키 쓰기가 불가능한 컨텍스트에서는 무시 (세션 갱신은 미들웨어/핸들러에서 처리)
        }
      },
    },
  });
}

/**
 * 공개 데이터 읽기 전용(쿠키 미사용) Supabase 클라이언트.
 * 세션이 필요 없는 공개 카탈로그 조회에 사용한다. 쿠키를 쓰지 않으므로
 * generateStaticParams / sitemap 같은 빌드 타임 컨텍스트에서도 안전하게 호출된다.
 */
export function createSupabaseReadClient() {
  const { url, key } = requirePublicSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
