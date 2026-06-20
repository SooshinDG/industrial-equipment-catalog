/**
 * 기존 최종 CSV(data/products.csv)의 40개 제품을 Supabase products 테이블에 시드한다.
 * CSV를 단일 출처로 사용하므로 product_id·slug·가격·재고·납기·featured·최종 사양 값이 그대로 반영된다.
 * product_id 기준 upsert 이므로 재실행해도 안전하다(기존 행은 갱신).
 *
 * 실행:
 *   1) 환경변수 준비: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY (또는 SUPABASE_SERVICE_ROLE_KEY)
 *      - .env.local 이 있으면 자동으로 읽는다.
 *   2) npx tsx scripts/seed-products.ts            # 실제 업서트
 *      npx tsx scripts/seed-products.ts --dry-run  # DB 접속 없이 시드 페이로드 검증(40개/카테고리 8개)
 *
 * 주의: secret(service-role) 키를 사용하므로 신뢰된 로컬/CI 환경에서만 실행한다.
 */
/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parseCsvToRecords } from "../src/lib/csv";

interface ProductSeedRow {
  product_id: string;
  slug: string;
  product_name: string;
  category: string;
  manufacturer: string;
  model: string;
  use_case: string;
  main_spec_label: string;
  main_spec_value: string;
  sub_spec_label: string;
  sub_spec_value: string;
  voltage: string;
  power_kw: number;
  price_krw: number;
  lead_time_days: number;
  stock_status: string;
  certification: string;
  featured: boolean;
  summary: string;
  is_active: boolean;
}

function loadEnvLocal(): void {
  try {
    const txt = readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  } catch {
    // .env.local 이 없으면 무시하고 실제 환경변수를 사용한다.
  }
}

function toNumber(value: string): number {
  const n = Number((value ?? "").replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function toBoolean(value: string): boolean {
  return /^(true|1|y|yes|예)$/i.test((value ?? "").trim());
}

function buildRows(): ProductSeedRow[] {
  const csvPath = path.join(process.cwd(), "data", "products.csv");
  const records = parseCsvToRecords(readFileSync(csvPath, "utf-8"));
  return records
    .filter((r) => r.product_id && r.slug && r.product_name && r.category)
    .map((r) => ({
      product_id: r.product_id,
      slug: r.slug,
      product_name: r.product_name,
      category: r.category,
      manufacturer: r.manufacturer || "미지정",
      model: r.model || "—",
      use_case: r.use_case || "",
      main_spec_label: r.main_spec_label || "",
      main_spec_value: r.main_spec_value || "",
      sub_spec_label: r.sub_spec_label || "",
      sub_spec_value: r.sub_spec_value || "",
      voltage: r.voltage || "—",
      power_kw: toNumber(r.power_kw),
      price_krw: toNumber(r.price_krw),
      lead_time_days: toNumber(r.lead_time_days),
      stock_status: r.stock_status || "주문 생산",
      certification: r.certification || "해당 없음",
      featured: toBoolean(r.featured),
      summary: r.summary || "",
      is_active: true,
    }));
}

function summarize(rows: ProductSeedRow[]): void {
  const byCategory = new Map<string, number>();
  for (const row of rows) {
    byCategory.set(row.category, (byCategory.get(row.category) ?? 0) + 1);
  }
  console.log(`제품 ${rows.length}개`);
  for (const [category, count] of byCategory) {
    console.log(`  - ${category}: ${count}개`);
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  const rows = buildRows();

  console.log("[seed] CSV에서 읽은 시드 페이로드:");
  summarize(rows);

  if (process.argv.includes("--dry-run")) {
    console.log("[seed] --dry-run: DB에 접속하지 않고 페이로드만 검증했습니다.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error(
      "[seed] 환경변수가 없습니다. NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SECRET_KEY" +
        "(또는 SUPABASE_SERVICE_ROLE_KEY)를 설정하세요.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "product_id" });

  if (error) {
    console.error(`[seed] upsert 실패: ${error.message}`);
    process.exit(1);
  }

  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) {
    console.error(`[seed] 검증 조회 실패: ${countError.message}`);
    process.exit(1);
  }

  console.log(`[seed] 업서트 완료. is_active=true 제품 수: ${count}`);
  console.log("[seed] 카테고리별 8개/총 40개 여부는 Supabase에서 추가 확인하세요.");
}

main().catch((err) => {
  console.error("[seed] 예기치 못한 오류:", err);
  process.exit(1);
});
