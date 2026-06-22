import type { Config } from "tailwindcss";

/**
 * Dark, premium, restrained — Linear / Vercel / Superhuman lineage. A single
 * indigo accent (shared with the rendered video) carries all emphasis; the rest
 * is near-black canvas, elevated panels, and hairline borders.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#08090C",
        surface: "#0E1014",
        panel: "#13161C",
        elevated: "#181C23",
        hairline: "rgba(255,255,255,0.08)",
        ink: "#F5F7FA",
        muted: "rgba(245,247,250,0.62)",
        faint: "rgba(245,247,250,0.40)",
        accent: { DEFAULT: "#6366F1", soft: "rgba(99,102,241,0.16)", ring: "rgba(99,102,241,0.45)" },
        ok: "#34D399",
        warn: "#FBBF24",
        bad: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 60px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(99,102,241,0.35), 0 12px 40px rgba(99,102,241,0.18)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        shimmer: "shimmer 1.8s infinite",
        "fade-up": "fade-up 0.4s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
