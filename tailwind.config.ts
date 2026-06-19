import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 웜화이트 종이 톤 — 페이지 바탕. 카드(흰색)와 미세한 대비를 만든다.
        paper: "#faf9f6",
        brand: {
          50: "#f4f6f9",
          100: "#e6eaf1",
          200: "#c8d2e0",
          300: "#9babc4",
          400: "#6a80a3",
          500: "#4a6188",
          600: "#3a4d6e",
          700: "#2f3f59",
          800: "#1f2a3d",
          900: "#141c2b",
        },
        accent: {
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fee08a",
          300: "#fdc94d",
          400: "#fbb324",
          500: "#f59e0b",
          600: "#d97f06",
          700: "#b45c09",
          800: "#92480e",
          900: "#783c0f",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "sans-serif",
        ],
        // 기술 정보(모델 코드·가격·수치 사양) 전용. 본문/제목에는 쓰지 않는다.
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
