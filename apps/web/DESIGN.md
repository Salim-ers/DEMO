# DemoForge — Art Direction

**Positioning:** _AI demo video studio for SaaS teams._ The interface should feel
like a high-end creative studio, not an internal admin tool — immersive, cinematic,
confident.

## Foundations

- **Background:** deep space `#05050A` with violet/cyan/pink radial halos + fine film grain.
- **Spectrum:** electric violet `#8B5CF6` → blue `#3B82F6` → cyan `#22D3EE`, pink `#EC4899` kicker, gold `#F5C76B` for warmth.
- **Surfaces:** glass — `rgba(255,255,255,0.045)` fills, `rgba(255,255,255,0.12)` hairlines, `backdrop-blur`.
- **Type:** Inter, tight tracking; hero headlines `clamp(3rem, 8vw, 7rem)`; gradient ink for emphasis words (`.text-gradient`).
- **Depth:** soft deep shadows, gradient hairline borders (`.border-gradient`), glow on primary actions.

All values live as CSS variables in `app/globals.css` and as Tailwind tokens in
`tailwind.config.ts`. Token **names are semantic** (`canvas`, `panel`, `ink`,
`accent`…), so the whole app re-skins from one place.

## Building blocks

- `lib/motion.ts` — Framer Motion variants (`fadeUp`, `staggerContainer`, `blurIn`, `heroTextReveal`, `cardHover`, `slowFloat`).
- `components/ui/` — `glow-button` (magnetic), `premium-card`, `product-showcase-card` (bento), `metric-card` (count-up), `motion-tabs` (layoutId indicator), `section-label`, `animated-gradient`, `noise-layer`.
- `components/marketing/video-studio-preview` — the animated fake editor used as the hero visual.
- `components/brand/logo` — DemoForge gradient mark + wordmark + emblem.

## Motion principles

Fade + lift entrances, staggered children, spring hover lifts, scroll reveals
(`whileInView`, once), subtle parallax, a light magnetic pull on CTAs. Wrapped in
`<MotionConfig reducedMotion="user">` and gated by `prefers-reduced-motion` in CSS —
nothing heavy runs for users who opt out.

## Render presets (`packages/render/src/styles/videoBrand.ts`)

- **Creative AI Studio** (`creative_ai_studio`) — the house style: near-black, violet→cyan, pink kicker. Vibrant, cinematic.
- **Luxury Product Demo** (`luxury_product`) — cream / saddle brown / soft gold / deep green / premium black. Calm, confident. Auto-selected for Horse Ledger.

## Bar

No page should read as a generic dark SaaS dashboard. The home must land a "wow",
cards must feel premium, motion must be fluid, copy short and strong — the whole
thing should evoke a high-end Framer-grade production.
