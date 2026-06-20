import "server-only";

import { cache } from "react";
import { createSupabaseReadClient } from "@/lib/supabase/server";
import { STOCK_STATUSES, type Product, type StockStatus } from "@/lib/types";
import type { ProductRepository } from "./repository";
import {
  deriveCategoryCounts,
  deriveFeatured,
  deriveFilterFacets,
  deriveRelated,
} from "./derive";

/** Supabase products 행(snake_case) → Product(camelCase) 매핑 */
interface ProductRow {
  product_id: string;
  slug: string;
  product_name: string;
  category: string;
  manufacturer: string | null;
  model: string | null;
  use_case: string | null;
  main_spec_label: string | null;
  main_spec_value: string | null;
  sub_spec_label: string | null;
  sub_spec_value: string | null;
  voltage: string | null;
  power_kw: number | string | null;
  price_krw: number | string | null;
  lead_time_days: number | string | null;
  stock_status: string | null;
  certification: string | null;
  featured: boolean | null;
  summary: string | null;
}

function toStockStatus(value: string | null): StockStatus {
  return value && (STOCK_STATUSES as string[]).includes(value)
    ? (value as StockStatus)
    : "주문 생산";
}

function toNum(value: number | string | null): number {
  if (value === null) return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapRow(row: ProductRow): Product {
  return {
    productId: row.product_id,
    slug: row.slug,
    productName: row.product_name,
    category: row.category,
    manufacturer: row.manufacturer || "미지정",
    model: row.model || "—",
    useCase: row.use_case || "",
    mainSpecLabel: row.main_spec_label || "",
    mainSpecValue: row.main_spec_value || "",
    subSpecLabel: row.sub_spec_label || "",
    subSpecValue: row.sub_spec_value || "",
    voltage: row.voltage || "—",
    powerKw: toNum(row.power_kw),
    priceKrw: toNum(row.price_krw),
    leadTimeDays: toNum(row.lead_time_days),
    stockStatus: toStockStatus(row.stock_status),
    certification: row.certification || "해당 없음",
    featured: Boolean(row.featured),
    summary: row.summary || "",
  };
}

/**
 * 공개 노출 제품 전체(is_active=true)를 1회 조회해 요청 단위로 캐시.
 * RLS 정책상 공개 키로는 is_active=true 행만 조회되지만, 명시적으로도 필터링한다.
 */
const fetchActiveProducts = cache(async (): Promise<Product[]> => {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("product_id", { ascending: true });

  if (error) {
    throw new Error(
      `[products:supabase] 제품 조회 실패: ${error.message}. ` +
        `마이그레이션/시드가 적용되었는지, 환경변수와 RLS 정책을 확인하세요.`,
    );
  }
  return (data as ProductRow[]).map(mapRow);
});

/**
 * Supabase products 테이블을 출처로 사용하는 repository.
 * 공개 조회는 쿠키 미사용 read 클라이언트(anon/publishable + RLS)를 통해 수행한다.
 */
export function createSupabaseRepository(): ProductRepository {
  return {
    async getActiveProducts() {
      return fetchActiveProducts();
    },
    async getProductBySlug(slug) {
      const supabase = createSupabaseReadClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        throw new Error(`[products:supabase] slug 조회 실패(${slug}): ${error.message}`);
      }
      return data ? mapRow(data as ProductRow) : null;
    },
    async getFeaturedProducts(limit = 6) {
      return deriveFeatured(await fetchActiveProducts(), limit);
    },
    async getRelatedProducts(product, limit = 4) {
      return deriveRelated(await fetchActiveProducts(), product, limit);
    },
    async getCategoryCounts() {
      return deriveCategoryCounts(await fetchActiveProducts());
    },
    async getCategories() {
      return deriveCategoryCounts(await fetchActiveProducts()).map(
        (c) => c.category,
      );
    },
    async getFilterFacets() {
      return deriveFilterFacets(await fetchActiveProducts());
    },
  };
}
