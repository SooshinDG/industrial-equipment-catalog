import "server-only";

import type { Product } from "@/lib/types";
import { getProductRepository } from "./repository";

/**
 * 공개 제품 데이터 API.
 * 기존 `@/lib/products` 의 함수 시그니처를 그대로 유지해 UI/페이지가 데이터 출처(CSV/Supabase)를
 * 알 필요 없이 동일하게 사용한다. 실제 구현은 PRODUCT_DATA_SOURCE 로 선택된 repository가 담당한다.
 */

/** 공개 노출 대상 제품 전체 (기존 동작과 동일하게 사용) */
export async function getAllProducts(): Promise<Product[]> {
  return getProductRepository().getActiveProducts();
}

/** getAllProducts 의 명시적 별칭 (repository 인터페이스 명칭과 일치) */
export const getActiveProducts = getAllProducts;

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  // 기존 API는 undefined 반환 계약이므로 null → undefined 로 정규화
  return (await getProductRepository().getProductBySlug(slug)) ?? undefined;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProductRepository().getFeaturedProducts(limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return getProductRepository().getRelatedProducts(product, limit);
}

export async function getCategoryCounts(): Promise<
  { category: string; count: number }[]
> {
  return getProductRepository().getCategoryCounts();
}

export async function getCategories(): Promise<string[]> {
  return getProductRepository().getCategories();
}

export async function getFilterFacets() {
  return getProductRepository().getFilterFacets();
}

export type { ProductRepository, ProductDataSource } from "./repository";
export { resolveDataSource } from "./repository";
