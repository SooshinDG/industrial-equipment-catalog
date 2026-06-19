import { getStockBadge } from "@/lib/format";
import type { StockStatus } from "@/lib/types";

export function StockBadge({ status }: { status: StockStatus }) {
  const badge = getStockBadge(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
      추천
    </span>
  );
}
