import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
};

export default config;
