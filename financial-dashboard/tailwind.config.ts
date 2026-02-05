import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        cream: "#f2f0e6",
        "cream-dark": "#e6e4da",
        foreground: "#0f0f0f",
        muted: "#555555",
        "border-default": "#0f0f0f",
        positive: "#22c55e",
        negative: "#ef4444",
      },
      backgroundColor: {
        "card-dark": "rgba(15, 15, 15, 0.85)",
      },
      width: {
        sidebar: "200px",
      },
      spacing: {
        sidebar: "200px",
        "main-x": "3rem",
        "main-y": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;
