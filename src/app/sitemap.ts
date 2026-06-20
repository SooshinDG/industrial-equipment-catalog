import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/inquiry`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productRoutes = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    // 데이터 소스에 접근할 수 없어도(예: 미시드 Supabase) 정적 경로만으로 sitemap을 생성한다.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sitemap] 제품 목록을 불러오지 못했습니다:", error);
    }
  }

  return [...staticRoutes, ...productRoutes];
}
