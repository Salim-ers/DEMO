import type { Config } from "tailwindcss";

/**
 * Studio One — cinematic, warm, editorial. Deep near-black canvas, cream ink, and
 * a brown → caramel → gold spectrum. Glass tinted cream, deep shadows, warm halos.
 * Semantic token names are preserved so the whole app re-skins from here.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#040302",
        "canvas-soft": "#0D0906",
        surface: "rgba(255,244,228,0.05)",
        panel: "rgba(255,244,228,0.05)",
        elevated: "rgba(255,244,228,0.09)",
        hairline: "rgba(255,244,228,0.13)",
        ink: "#FFF4E4",
        muted: "rgba(255,244,228,0.68)",
        faint: "rgba(255,244,228,0.40)",
        accent: {
          DEFAULT: "#B9824A",
          deep: "#D8A460",
          soft: "rgba(185,130,74,0.16)",
          ring: "rgba(185,130,74,0.5)",
        },
        // Studio One spectrum.
        brown: "#7A4C2A",
        caramel: "#B9824A",
        gold: "#D8A460",
        cream: "#FFF4E4",
        "deep-brown": "#1A1009",
        studio: "#040302",
        // Previous aliases → warm equivalents, so existing markup holds.
        violet: "#B9824A",
        blue: "#7A4C2A",
        cyan: "#D8A460",
        pink: "#C08A4E",
        ivory: "#FFF4E4",
        espresso: "#040302",
        champagne: "rgba(255,244,228,0.09)",
        bronze: "#7A4C2A",
        cognac: "#B9824A",
        // Status.
        ok: "#6BA579",
        warn: "#D8A460",
        bad: "#D9694B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.055em",
        tighter: "-0.04em",
        tight: "-0.02em",
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "30px" },
      boxShadow: {
        panel: "0 1px 0 rgba(255,244,228,0.05) inset, 0 30px 70px -24px rgba(0,0,0,0.8)",
        soft: "0 40px 120px -50px rgba(0,0,0,0.9)",
        glow: "0 0 0 1px rgba(185,130,74,0.32), 0 22px 60px -14px rgba(185,130,74,0.45)",
        "glow-lg": "0 30px 120px -30px rgba(185,130,74,0.5)",
        ring: "0 0 0 4px rgba(185,130,74,0.16)",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #7A4C2A 0%, #B9824A 50%, #D8A460 100%)",
        aurora: "linear-gradient(120deg, #6B3F22 0%, #7A4C2A 30%, #B9824A 65%, #D8A460 100%)",
        "aurora-soft": "linear-gradient(120deg, rgba(122,76,42,0.22), rgba(185,130,74,0.16), rgba(216,164,96,0.14))",
        "pink-violet": "linear-gradient(135deg, #D8A460 0%, #7A4C2A 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,244,228,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,244,228,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: "0.6" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-11px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "soft-pulse": { "0%,100%": { opacity: "0.45" }, "50%": { opacity: "1" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        shimmer: "shimmer 2.4s infinite",
        "fade-up": "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 8s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "gradient-pan": "gradient-pan 9s ease infinite",
        "soft-pulse": "soft-pulse 3.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
