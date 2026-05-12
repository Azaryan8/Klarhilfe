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
        background: "#0a0a0a",
        surface: "#141414",
        surface2: "#1a1a1a",
        gold: "#c9a84c",
        "gold-dim": "#a68b3d",
        cream: "#f5f2eb",
        muted: "rgba(245, 242, 235, 0.65)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-ibm-plex)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 40px rgba(201, 168, 76, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
