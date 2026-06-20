import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ExistingProduct } from "./import/diff";
import type { ImportRecord } from "./import/types";

/** 관리자 컨텍스트: diff 계산을 위해 전체 제품(비활성 포함)을 조회한다(service-role, RLS 우회) */
export async function fetchAllProductsForDiff(): Promise<ExistingProduct[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    throw new Error(`현재 제품 조회 실패: ${error.message}`);
  }
  return (data ?? []) as ExistingProduct[];
}

/** 현재 활성/전체 제품 수 (관리자 대시보드 상태 표시용) */
export async function fetchProductCounts(): Promise<{
  total: number;
  active: number;
}> {
  const supabase = createSupabaseAdminClient();
  const [{ count: total }, { count: active }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);
  return { total: total ?? 0, active: active ?? 0 };
}

/**
 * 검증·충돌 통과 레코드를 원자적으로 반영한다.
 * 단일 bulk upsert = 단일 INSERT ... ON CONFLICT 문 → all-or-nothing(원자성).
 * 반복 루프 upsert 를 쓰지 않으므로 중간 실패로 일부만 반영되는 일이 없다.
 * slug unique 충돌 등으로 문이 실패하면 전체가 롤백된다.
 */
export async function applyProductImport(
  records: ImportRecord[],
): Promise<number> {
  if (records.length === 0) return 0;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .upsert(records, { onConflict: "product_id" })
    .select("product_id");
  if (error) {
    throw new Error(error.message);
  }
  return data?.length ?? records.length;
}
