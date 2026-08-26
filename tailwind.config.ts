import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          50: "#f2fbf5",
          100: "#e1f7e8",
          200: "#c4ebd3",
          300: "#96d6ad",
          400: "#5bb87d",
          500: "#34a05e",
          600: "#24864b",
          700: "#1f6b3d",
          800: "#1c5634",
          900: "#1a472d",
        },
        warm: {
          50: "#faf9f7",
          100: "#f5f3ef",
          200: "#eae6df",
          300: "#ddd7cd",
          400: "#c4bdb1",
          500: "#a8a08e",
          600: "#8c8373",
          700: "#736b5e",
          800: "#5e574d",
          900: "#4a453e",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 / 0.04)",
        "card-hover": "0 10px 25px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
        "card-completed": "0 1px 3px 0 rgb(0 0 0 / 0.03), 0 1px 2px -1px rgb(0 0 / 0.03)",
      },
      animation: {
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-soft": "bounceSoft 0.4s ease-out",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        bounceSoft: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
