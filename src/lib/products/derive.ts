import { STOCK_STATUSES, type Product, type StockStatus } from "@/lib/types";

/**
 * 제품 배열에서 파생 데이터를 계산하는 순수 함수 모음.
 * CSV·Supabase 두 repository가 동일한 결과를 내도록 공유한다.
 * (데이터 출처와 무관하게 홈/목록/상세의 표시 결과가 같아야 함)
 */

export function deriveFeatured(products: Product[], limit = 6): Product[] {
  const featured = products.filter((p) => p.featured);
  const pool = featured.length >= limit ? featured : products;
  return pool.slice(0, limit);
}

export function deriveRelated(
  products: Product[],
  product: Product,
  limit = 4,
): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function deriveCategoryCounts(
  products: Product[],
): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return Array.from(counts, ([category, count]) => ({ category, count }));
}

export function deriveFilterFacets(products: Product[]): {
  categories: string[];
  voltages: string[];
  stockStatuses: StockStatus[];
} {
  return {
    categories: Array.from(new Set(products.map((p) => p.category))),
    voltages: Array.from(new Set(products.map((p) => p.voltage))).sort(),
    stockStatuses: STOCK_STATUSES.filter((s) =>
      products.some((p) => p.stockStatus === s),
    ),
  };
}
