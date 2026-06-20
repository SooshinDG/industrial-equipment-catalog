import "server-only";

import type { Product, StockStatus } from "@/lib/types";
import { createCsvRepository } from "./csv-repository";
import { createSupabaseRepository } from "./supabase-repository";

/**
 * 제품 데이터 접근 공통 인터페이스.
 * UI/페이지는 이 인터페이스(또는 index.ts의 래퍼)만 사용하고, 실제 출처(CSV/Supabase)는 알지 못한다.
 * 검색·필터·정렬·페이지네이션은 getActiveProducts() 결과 배열에 대해 catalog.ts의 순수 함수로 수행한다.
 */
export interface ProductRepository {
  /** 공개 노출 대상(is_active=true) 제품 전체 */
  getActiveProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getCategoryCounts(): Promise<{ category: string; count: number }[]>;
  getCategories(): Promise<string[]>;
  getFilterFacets(): Promise<{
    categories: string[];
    voltages: string[];
    stockStatuses: StockStatus[];
  }>;
}

export type ProductDataSource = "csv" | "supabase";

/**
 * PRODUCT_DATA_SOURCE 로 데이터 출처를 명시적으로 선택한다.
 * - 미설정 시 기존 동작과 동일한 'csv'를 기본값으로 사용 (저장소 내 CSV)
 * - 'csv' / 'supabase' 외의 값이면 조용히 넘어가지 않고 명확한 오류를 던진다
 */
export function resolveDataSource(): ProductDataSource {
  const raw = process.env.PRODUCT_DATA_SOURCE?.trim().toLowerCase();
  if (!raw) return "csv";
  if (raw === "csv" || raw === "supabase") return raw;
  throw new Error(
    `[products] 잘못된 PRODUCT_DATA_SOURCE 값입니다: "${process.env.PRODUCT_DATA_SOURCE}". ` +
      `'csv' 또는 'supabase' 중 하나여야 합니다.`,
  );
}

let cachedRepository: ProductRepository | null = null;
let cachedSource: ProductDataSource | null = null;

export function getProductRepository(): ProductRepository {
  const source = resolveDataSource();
  if (cachedRepository && cachedSource === source) return cachedRepository;
  cachedSource = source;
  cachedRepository =
    source === "supabase"
      ? createSupabaseRepository()
      : createCsvRepository();
  return cachedRepository;
}
