import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hilo: {
          black:  "#111111",
          white:  "#FAFAF8",
          gold:   "#C4A46B",
          "gold-light": "#E8D5B0",
          gray:   "#6B6B6B",
          light:  "#F4F1EC",
          border: "#E5DFD5",
          card:   "#FFFFFF",
          muted:  "#9A9289",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hilo-gradient": "linear-gradient(135deg, #111111 0%, #2C2218 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
