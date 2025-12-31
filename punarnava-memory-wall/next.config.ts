import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933",
        emerald: "#138808",
        gold: "#FFD700",
        cream: "#FFFDD0",
        deepBlue: "#000080", // Added for contrast text
      },
      fontFamily: {
        heading: ['var(--font-cinzel-decorative)'],
        body: ['var(--font-poppins)'],
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
      },
      backgroundImage: {
        // A CSS-based mandala pattern so you don't need to download an SVG file
        'mandala-pattern': "radial-gradient(circle at center, transparent 0%, transparent 20%, var(--tw-color-gold) 20.5%, transparent 21%, transparent 30%, var(--tw-color-saffron) 30.5%, transparent 31%, transparent 40%, var(--tw-color-emerald) 40.5%, transparent 41%), repeating-conic-gradient(from 0deg, transparent 0deg 10deg, var(--tw-color-gold) 10deg 10.5deg, transparent 10.5deg 20deg), repeating-conic-gradient(from 5deg, transparent 0deg 10deg, var(--tw-color-saffron) 10deg 10.5deg, transparent 10.5deg 20deg)",
      },
    },
  },
  plugins: [],
};
export default config;