import type { Config } from "tailwindcss";

/**
 * Studio One — sober, warm, professional. Deep near-black canvas, cream ink, and a
 * single brown → caramel accent. No neon, no glow, no aurora. Semantic token names
 * are preserved so the whole app re-skins from here.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#060504",
        "canvas-soft": "#11100E",
        surface: "rgba(255,247,236,0.04)",
        panel: "rgba(255,247,236,0.04)",
        elevated: "rgba(255,247,236,0.07)",
        hairline: "rgba(255,247,236,0.14)",
        ink: "#FFF7EC",
        muted: "rgba(255,247,236,0.68)",
        faint: "rgba(255,247,236,0.45)",
        accent: {
          DEFAULT: "#B9824A",
          deep: "#C99560",
          soft: "rgba(185,130,74,0.14)",
          ring: "rgba(185,130,74,0.40)",
        },
        // Studio One spectrum.
        brown: "#8B5E34",
        caramel: "#B9824A",
        gold: "#C99560",
        cream: "#FFF7EC",
        "cream-soft": "#F3E7D7",
        "deep-brown": "#1A130D",
        studio: "#060504",
        // Legacy aliases → warm equivalents, so any leftover markup stays sober.
        violet: "#B9824A",
        blue: "#8B5E34",
        cyan: "#C99560",
        pink: "#B9824A",
        ivory: "#FFF7EC",
        espresso: "#060504",
        champagne: "rgba(255,247,236,0.07)",
        bronze: "#8B5E34",
        cognac: "#B9824A",
        // Status.
        ok: "#6BA579",
        warn: "#C99560",
        bad: "#D9694B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Poppins", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      borderRadius: { xl: "14px", "2xl": "20px", "3xl": "28px" },
      boxShadow: {
        panel: "0 1px 0 rgba(255,247,236,0.03) inset, 0 18px 40px -28px rgba(0,0,0,0.7)",
        soft: "0 24px 60px -36px rgba(0,0,0,0.8)",
        glow: "0 14px 34px -18px rgba(0,0,0,0.7)",
        "glow-lg": "0 24px 60px -30px rgba(0,0,0,0.75)",
        ring: "0 0 0 4px rgba(185,130,74,0.14)",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #8B5E34 0%, #B9824A 100%)",
        aurora: "linear-gradient(120deg, #8B5E34 0%, #B9824A 100%)",
        "aurora-soft": "linear-gradient(120deg, rgba(139,94,52,0.14), rgba(185,130,74,0.10))",
        "pink-violet": "linear-gradient(135deg, #B9824A 0%, #8B5E34 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,247,236,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,247,236,0.03) 1px, transparent 1px)",
      },
      keyframes: {
        "pulse-ring": { "0%": { transform: "scale(0.8)", opacity: "0.6" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.98)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "spin-slow": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        "gradient-pan": { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        "soft-pulse": { "0%,100%": { opacity: "0.5" }, "50%": { opacity: "1" } },
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
      },
    },
  },
  plugins: [],
};
export default config;
