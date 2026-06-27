import type { Config } from "tailwindcss";

/**
 * Studio One — dark cinematic studio. Deep near-black canvas with a warm
 * undertone, warm-cream ink, and a controlled bronze → champagne accent ramp.
 * Cold accents (ice / iris) are reserved for the editing timeline & processing
 * states only. Semantic token names are preserved so the whole app re-skins
 * from here.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Background layers (warm near-black).
        canvas: "#050403",
        "canvas-soft": "#0D0B09",
        "canvas-deep": "#030201",
        // Glass surfaces (champagne-tinted).
        surface: "rgba(246,231,204,0.035)",
        panel: "rgba(246,231,204,0.04)",
        elevated: "rgba(246,231,204,0.07)",
        hairline: "rgba(246,231,204,0.12)",
        // Ink.
        ink: "#FFF7EA",
        muted: "rgba(255,247,234,0.68)",
        faint: "rgba(255,247,234,0.6)",
        // Bronze accent ramp.
        accent: {
          DEFAULT: "#C68642",
          deep: "#E3B36D",
          soft: "rgba(198,134,66,0.14)",
          ring: "rgba(198,134,66,0.42)",
        },
        // Studio spectrum.
        brown: "#8B5E34",
        caramel: "#C68642",
        gold: "#E3B36D",
        champagne: "#F6E7CC",
        cream: "#FFF7EA",
        "cream-soft": "#F3E7D7",
        "deep-brown": "#1A130D",
        studio: "#050403",
        // Cold accents — timeline / processing only.
        ice: "#55D8FF",
        iris: "#8A6CFF",
        // Legacy aliases (kept so leftover markup stays coherent).
        violet: "#8A6CFF",
        blue: "#5B8DEF",
        cyan: "#55D8FF",
        pink: "#C68642",
        ivory: "#FFF7EA",
        espresso: "#050403",
        bronze: "#8B5E34",
        cognac: "#C68642",
        // Status.
        ok: "#4FB477",
        warn: "#E8924A",
        bad: "#D9694B",
        processing: "#5B8DEF",
        draft: "#9A9389",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px", "4xl": "36px" },
      boxShadow: {
        panel: "0 1px 0 rgba(246,231,204,0.05) inset, 0 24px 60px -34px rgba(0,0,0,0.85)",
        soft: "0 30px 80px -42px rgba(0,0,0,0.85)",
        glow: "0 18px 44px -22px rgba(0,0,0,0.8)",
        "glow-lg": "0 30px 80px -36px rgba(0,0,0,0.82)",
        "glow-accent": "0 0 0 1px rgba(198,134,66,0.22), 0 26px 70px -28px rgba(198,134,66,0.42)",
        ring: "0 0 0 4px rgba(198,134,66,0.16)",
        "inset-hairline": "0 0 0 1px rgba(246,231,204,0.10) inset",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #8B5E34 0%, #C68642 46%, #E3B36D 100%)",
        "bronze-soft": "linear-gradient(135deg, rgba(139,94,52,0.18), rgba(227,179,109,0.12))",
        aurora: "linear-gradient(120deg, #8B5E34 0%, #C68642 50%, #E3B36D 100%)",
        "aurora-soft": "linear-gradient(120deg, rgba(139,94,52,0.16), rgba(227,179,109,0.10))",
        "grid-faint":
          "linear-gradient(rgba(246,231,204,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(246,231,204,0.035) 1px, transparent 1px)",
        "mesh-hero":
          "radial-gradient(60% 55% at 50% 18%, rgba(198,134,66,0.22) 0%, rgba(139,94,52,0.06) 42%, transparent 72%), radial-gradient(40% 40% at 82% 8%, rgba(227,179,109,0.10) 0%, transparent 60%)",
      },
      keyframes: {
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: "0.6" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.98)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "soft-pulse": { "0%,100%": { opacity: "0.45" }, "50%": { opacity: "1" } },
        "glow-breathe": { "0%,100%": { opacity: "0.5", transform: "scale(1)" }, "50%": { opacity: "0.85", transform: "scale(1.06)" } },
        "scan-x": { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(120%)" } },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        shimmer: "shimmer 2.4s infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.6s ease both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 8s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "spin-slow": "spin-slow 30s linear infinite",
        "gradient-pan": "gradient-pan 9s ease infinite",
        "soft-pulse": "soft-pulse 3.4s ease-in-out infinite",
        "glow-breathe": "glow-breathe 7s ease-in-out infinite",
        "scan-x": "scan-x 3.4s cubic-bezier(0.5,0,0.5,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
