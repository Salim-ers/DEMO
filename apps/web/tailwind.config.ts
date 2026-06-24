import type { Config } from "tailwindcss";

/**
 * DemoForge — a deep-space, cinematic system. Near-black canvas, glass surfaces,
 * and an electric spectrum (violet → blue → cyan, with pink + gold) carry all
 * energy. Semantic token names are preserved so the whole app re-skins from here;
 * warm aliases from the previous identity are remapped to their dark equivalents.
 */
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — near-black canvas, glass panels.
        canvas: "#05050A",
        surface: "rgba(255,255,255,0.045)",
        panel: "rgba(255,255,255,0.045)",
        elevated: "rgba(255,255,255,0.08)",
        hairline: "rgba(255,255,255,0.12)",
        // Ink.
        ink: "#F7F7FB",
        muted: "rgba(247,247,251,0.68)",
        faint: "rgba(247,247,251,0.42)",
        // Primary accent — electric violet. `deep` reads on dark surfaces.
        accent: {
          DEFAULT: "#8B5CF6",
          deep: "#A78BFA",
          soft: "rgba(139,92,246,0.16)",
          ring: "rgba(139,92,246,0.5)",
        },
        // Spectrum.
        violet: "#8B5CF6",
        blue: "#3B82F6",
        cyan: "#22D3EE",
        pink: "#EC4899",
        gold: "#F5C76B",
        // Warm aliases (previous identity) → dark equivalents, so old markup holds.
        ivory: "#F7F7FB",
        espresso: "#05050A",
        champagne: "rgba(255,255,255,0.08)",
        bronze: "#8B5CF6",
        cognac: "#3B82F6",
        caramel: "#22D3EE",
        // Status.
        ok: "#34D399",
        warn: "#FBBF24",
        bad: "#FB7185",
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
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px -20px rgba(0,0,0,0.7)",
        soft: "0 30px 90px -40px rgba(0,0,0,0.85)",
        glow: "0 0 0 1px rgba(139,92,246,0.3), 0 18px 50px -12px rgba(139,92,246,0.5)",
        "glow-cyan": "0 0 0 1px rgba(34,211,238,0.3), 0 18px 50px -12px rgba(34,211,238,0.45)",
        ring: "0 0 0 4px rgba(139,92,246,0.16)",
      },
      backgroundImage: {
        "bronze-sheen": "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #22D3EE 100%)",
        aurora: "linear-gradient(120deg, #8B5CF6 0%, #6366F1 35%, #3B82F6 65%, #22D3EE 100%)",
        "aurora-soft": "linear-gradient(120deg, rgba(139,92,246,0.18), rgba(59,130,246,0.14), rgba(34,211,238,0.12))",
        "pink-violet": "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
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
