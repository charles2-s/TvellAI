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
        forest: {
          50: "#f0f5f1",
          100: "#dce8df",
          200: "#b9d1c0",
          300: "#8ab39a",
          400: "#5a8d6f",
          500: "#3a7254",
          600: "#2d5a42",
          700: "#1F4D3A",
          800: "#1a3d2f",
          900: "#142f24",
          950: "#0d1f18",
        },
        clay: {
          50: "#fdf6f3",
          100: "#fbe8e0",
          200: "#f6cfc0",
          300: "#efad94",
          400: "#e38565",
          500: "#C1622D",
          600: "#a35224",
          700: "#84411d",
          800: "#6b3519",
          900: "#552d16",
          950: "#2e160c",
        },
        cream: {
          50: "#FDFCFA",
          100: "#FAF7F2",
          200: "#F5F0E8",
          300: "#EDE5D8",
          400: "#E0D5C1",
          500: "#D1C3A5",
          600: "#B8A88A",
          700: "#9C8B6E",
          800: "#7D6F56",
          900: "#5E5340",
          950: "#332D22",
        },
        charcoal: {
          50: "#F5F4F2",
          100: "#E8E6E1",
          200: "#D2CFC7",
          300: "#B0AB9E",
          400: "#8A8477",
          500: "#6B6459",
          600: "#544E45",
          700: "#3D3933",
          800: "#2E2B27",
          900: "#221F1B",
          950: "#141210",
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', "Georgia", "serif"],
        body: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 / 0.04)",
        "card-hover": "0 20px 40px -4px rgb(0 0 0 / 0.08), 0 8px 16px -6px rgb(0 0 / 0.04)",
        "card-completed": "0 1px 3px 0 rgb(0 0 / 0.03), 0 1px 2px -1px rgb(0 0 / 0.03)",
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
