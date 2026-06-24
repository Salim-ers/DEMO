import type { Config } from "tailwindcss";

/**
 * Studio One — a calm, cinematic, warm system. Deep near-black canvas, cream ink,
 * and a brown → caramel → soft-gold spectrum carry all warmth. Glass surfaces tinted
 * cream. Semantic token names are preserved so the whole app re-skins from here;
 * the previous vibrant aliases are remapped to their warm equivalents.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — deep black, cream-tinted glass.
        canvas: "#050403",
        surface: "rgba(255,248,238,0.055)",
        panel: "rgba(255,248,238,0.055)",
        elevated: "rgba(255,248,238,0.095)",
        hairline: "rgba(255,248,238,0.14)",
        // Ink.
        ink: "#FFF8EE",
        muted: "rgba(255,248,238,0.72)",
        faint: "rgba(255,248,238,0.45)",
        // Primary accent — caramel. `deep` (soft gold) reads on dark surfaces.
        accent: {
          DEFAULT: "#B9824A",
          deep: "#D6A15F",
          soft: "rgba(185,130,74,0.16)",
          ring: "rgba(185,130,74,0.5)",
        },
        // Studio One spectrum.
        brown: "#9B6A3C",
        caramel: "#B9824A",
        gold: "#D6A15F",
        cream: "#FFF3DF",
        studio: "#050403",
        // Previous vibrant aliases → warm equivalents, so old markup holds.
        violet: "#B9824A",
        blue: "#9B6A3C",
        cyan: "#D6A15F",
        pink: "#C98A4E",
        ivory: "#FFF8EE",
        espresso: "#050403",
        champagne: "rgba(255,248,238,0.095)",
        bronze: "#9B6A3C",
        cognac: "#B9824A",
        // Status — tuned for the warm dark theme.
        ok: "#5BA17E",
        warn: "#D6A15F",
        bad: "#D9694B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.035em",
        tight: "-0.02em",
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px" },
      boxShadow: {
        panel: "0 1px 0 rgba(255,248,238,0.05) inset, 0 24px 60px -20px rgba(0,0,0,0.7)",
        soft: "0 30px 90px -40px rgba(0,0,0,0.85)",
        glow: "0 0 0 1px rgba(185,130,74,0.32), 0 18px 50px -12px rgba(185,130,74,0.45)",
        "glow-cyan": "0 0 0 1px rgba(214,161,95,0.3), 0 18px 50px -12px rgba(214,161,95,0.4)",
        ring: "0 0 0 4px rgba(185,130,74,0.16)",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #9B6A3C 0%, #B9824A 50%, #D6A15F 100%)",
        aurora: "linear-gradient(120deg, #8A5A2E 0%, #9B6A3C 35%, #B9824A 65%, #D6A15F 100%)",
        "aurora-soft": "linear-gradient(120deg, rgba(155,106,60,0.20), rgba(185,130,74,0.16), rgba(214,161,95,0.14))",
        "pink-violet": "linear-gradient(135deg, #D6A15F 0%, #9B6A3C 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,248,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,248,238,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: "0.6" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-9px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "soft-pulse": { "0%,100%": { opacity: "0.5" }, "50%": { opacity: "1" } },
        "border-glow": { "0%,100%": { opacity: "0.4" }, "50%": { opacity: "1" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        shimmer: "shimmer 2s infinite",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        "spin-slow": "spin-slow 28s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "soft-pulse": "soft-pulse 3s ease-in-out infinite",
        "border-glow": "border-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
