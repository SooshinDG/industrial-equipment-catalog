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
    <form onSubmit={handleSubmit} role="search" className="w-full">
      <label htmlFor="home-search" className="sr-only">
        제품명, 모델, 용도, 제조사로 검색
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-300"
            aria-hidden="true"
          />
          <input
            id="home-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="예: 콤프레서, 펌프, 압력센서"
            className="w-full rounded-md border border-brand-200 bg-white py-3 pl-11 pr-4 text-base text-brand-800 placeholder:text-brand-300 focus:border-accent-400"
          />
        </div>
        <button type="submit" className="btn-primary py-3 sm:px-8">
          제품 검색
        </button>
      </div>
    </form>
  );
}
