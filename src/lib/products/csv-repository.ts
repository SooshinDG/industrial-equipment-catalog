import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parseCsvToRecords } from "@/lib/csv";
import { STOCK_STATUSES, type Product, type StockStatus } from "@/lib/types";
import type { ProductRepository } from "./repository";
import {
  deriveCategoryCounts,
  deriveFeatured,
  deriveFilterFacets,
  deriveRelated,
} from "./derive";

const CSV_PATH = path.join(process.cwd(), "data", "products.csv");

function toNumber(value: string): number {
  const n = Number(value.replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function toBoolean(value: string): boolean {
  return /^(true|1|y|yes|예)$/i.test(value.trim());
}

function isStockStatus(value: string): value is StockStatus {
  return (STOCK_STATUSES as string[]).includes(value);
}

/** 개발 환경에서만 경고를 출력해 빌드/런타임을 막지 않는다. */
function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[products:csv] ${message}`);
  }
}

/**
 * CSV 한 행을 검증하고 Product로 변환한다.
 * 필수 필드 누락 등 잘못된 행은 null을 반환해 전체 앱이 실패하지 않도록 한다.
 */
function validateRow(
  row: Record<string, string>,
  index: number,
): Product | null {
  const required = ["product_id", "slug", "product_name", "category"];
  for (const key of required) {
    if (!row[key]) {
      devWarn(`행 ${index + 2}: 필수 컬럼 '${key}' 누락 — 건너뜁니다.`);
      return null;
    }
  }

  const priceKrw = toNumber(row.price_krw);
  if (Number.isNaN(priceKrw)) {
    devWarn(
      `행 ${index + 2} (${row.slug}): price_krw 값 '${row.price_krw}'을(를) 숫자로 변환할 수 없습니다.`,
    );
  }

  const leadTimeDays = toNumber(row.lead_time_days);
  if (Number.isNaN(leadTimeDays)) {
    devWarn(
      `행 ${index + 2} (${row.slug}): lead_time_days 값 '${row.lead_time_days}'을(를) 숫자로 변환할 수 없습니다.`,
    );
  }

  let stockStatus: StockStatus = "주문 생산";
  if (isStockStatus(row.stock_status)) {
    stockStatus = row.stock_status;
  } else {
    devWarn(
      `행 ${index + 2} (${row.slug}): 알 수 없는 stock_status '${row.stock_status}' — '주문 생산'으로 대체합니다.`,
    );
  }

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
    powerKw: Number.isNaN(toNumber(row.power_kw)) ? 0 : toNumber(row.power_kw),
    priceKrw: Number.isNaN(priceKrw) ? 0 : priceKrw,
    leadTimeDays: Number.isNaN(leadTimeDays) ? 0 : leadTimeDays,
    stockStatus,
    certification: row.certification || "해당 없음",
    featured: toBoolean(row.featured),
    summary: row.summary || "",
  };
}

/** CSV를 1회 읽어 파싱·검증한 결과를 요청 단위로 캐시한다. */
const readCsvProducts = cache(async (): Promise<Product[]> => {
  const file = await readFile(CSV_PATH, "utf-8");
  const records = parseCsvToRecords(file);

  const seenSlugs = new Set<string>();
  const products: Product[] = [];

  records.forEach((row, index) => {
    const product = validateRow(row, index);
    if (!product) return;
    if (seenSlugs.has(product.slug)) {
      devWarn(`중복 slug '${product.slug}' — 첫 번째 항목만 사용합니다.`);
      return;
    }
    seenSlugs.add(product.slug);
    products.push(product);
  });

  if (products.length === 0) {
    devWarn("유효한 제품이 한 건도 없습니다. CSV를 확인하세요.");
  }

  return products;
});

/**
 * 저장소 내 CSV 파일을 출처로 사용하는 repository.
 * CSV에는 is_active 개념이 없으므로 모든 유효 행을 공개(active) 제품으로 취급한다.
 */
export function createCsvRepository(): ProductRepository {
  return {
    async getActiveProducts() {
      return readCsvProducts();
    },
    async getProductBySlug(slug) {
      const products = await readCsvProducts();
      return products.find((p) => p.slug === slug) ?? null;
    },
    async getFeaturedProducts(limit = 6) {
      return deriveFeatured(await readCsvProducts(), limit);
    },
    async getRelatedProducts(product, limit = 4) {
      return deriveRelated(await readCsvProducts(), product, limit);
    },
    async getCategoryCounts() {
      return deriveCategoryCounts(await readCsvProducts());
    },
    async getCategories() {
      return deriveCategoryCounts(await readCsvProducts()).map((c) => c.category);
    },
    async getFilterFacets() {
      return deriveFilterFacets(await readCsvProducts());
    },
  };
}
