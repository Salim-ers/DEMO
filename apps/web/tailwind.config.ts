import type { Config } from "tailwindcss";

/**
 * StudioOne — a warm, premium, art-directed system. Ivory canvas, espresso ink,
 * and a single cognac/bronze accent (drawn from the StudioOne badge) carry all
 * emphasis. Champagne neutrals and soft, warm shadows replace the cold dark-SaaS
 * lineage. Components reference these semantic tokens, so the palette is the
 * single source of truth for the whole brand.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm ivory → soft white, champagne for insets.
        canvas: "#F3ECE0",
        surface: "#FAF6EF",
        panel: "#FFFCF7",
        elevated: "#F1E8D9",
        hairline: "rgba(58,42,28,0.12)",
        // Ink — espresso on ivory.
        ink: "#2B2118",
        muted: "rgba(43,33,24,0.64)",
        faint: "rgba(43,33,24,0.42)",
        // Accent — cognac / bronze. `deep` for text+icons on light surfaces.
        accent: {
          DEFAULT: "#9A6534",
          deep: "#7C4F27",
          soft: "rgba(154,101,52,0.12)",
          ring: "rgba(154,101,52,0.38)",
        },
        // Named brand tones (for art-directed one-offs).
        bronze: "#9A6534",
        cognac: "#A6703B",
        caramel: "#C08E51",
        gold: "#C79A5B",
        espresso: "#2B2118",
        ivory: "#F7F1E7",
        champagne: "#EDE3D3",
        // Status — warm, muted, AA-legible on light tints.
        ok: "#2F7A4A",
        warn: "#9A7320",
        bad: "#B23A26",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        script: ["var(--font-script)", "Pacifico", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "26px",
      },
      boxShadow: {
        // Soft, warm, premium elevation — never a cheap hard drop shadow.
        panel: "0 1px 2px rgba(60,42,28,0.05), 0 14px 40px -16px rgba(60,42,28,0.18)",
        soft: "0 20px 56px -24px rgba(60,42,28,0.30)",
        glow: "0 0 0 1px rgba(154,101,52,0.22), 0 16px 40px -12px rgba(154,101,52,0.30)",
        ring: "0 0 0 4px rgba(154,101,52,0.14)",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #A6703B 0%, #8A5A2C 52%, #6F4521 100%)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.55" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(18px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        shimmer: "shimmer 1.8s infinite",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        reveal: "reveal 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "spin-slow": "spin-slow 26s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
