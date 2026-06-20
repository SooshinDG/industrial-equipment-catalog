"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function HomeSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="w-full max-w-xl">
      <label htmlFor="home-search" className="sr-only">
        제품명, 모델, 용도, 제조사로 검색
      </label>
      <div className="flex items-stretch">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400"
            aria-hidden="true"
          />
          <input
            id="home-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="예: 콤프레서, 펌프, 압력센서"
            className="h-11 w-full rounded-l-md border border-brand-300 bg-white pl-9 pr-3 text-sm text-brand-800 placeholder:text-brand-300 focus:z-10 focus:border-accent-400 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-r-md border border-accent-500 bg-accent-500 px-4 text-sm font-semibold text-brand-900 transition-colors hover:bg-accent-400"
        >
          제품 검색
        </button>
      </div>
    </form>
  );
}
