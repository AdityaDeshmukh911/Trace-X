/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        obsidian: {
          950: "#07090E",
          900: "#0C1017",
          850: "#101520",
          800: "#151B29",
          750: "#1C2436",
          700: "#242E44",
        },
        intel: {
          emerald: "#10B981",
          jade: "#059669",
          mint: "#34D399",
          amber: "#F59E0B",
          gold: "#D97706",
          crimson: "#EF4444",
        },
      },
      boxShadow: {
        "glow-emerald": "0 0 24px -4px rgba(16, 185, 129, 0.25)",
        "glow-emerald-lg": "0 0 40px -6px rgba(16, 185, 129, 0.35)",
        "glow-amber": "0 0 24px -4px rgba(245, 158, 11, 0.25)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
