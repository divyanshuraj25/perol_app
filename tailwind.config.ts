import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        paper: "var(--color-paper)",
        ink: "var(--color-ink)",
        line: "var(--color-line)",
        muted: "var(--color-muted)",
        navy: {
          DEFAULT: "var(--color-navy)",
          light: "var(--color-navy-light)",
          dark: "var(--color-navy-dark)",
        },
        gold: {
          DEFAULT: "var(--color-gold)",
          soft: "var(--color-gold-soft)",
        },
        positive: "var(--color-positive)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        document: "0 1px 2px rgba(16, 21, 31, 0.04), 0 8px 24px -12px rgba(16, 21, 31, 0.18)",
      },
      maxWidth: {
        document: "820px",
      },
    },
  },
  plugins: [],
};

export default config;
