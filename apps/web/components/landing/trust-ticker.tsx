const AUDIENCES = [
  "Fondateurs SaaS",
  "Équipes commerciales",
  "Agences",
  "Product marketers",
  "Startups",
  "E-commerce B2B",
  "Studios no-code",
  "Freelances",
  "Plateformes métier",
];

/**
 * A single, restrained marquee of who Studio One is for. Marks/words only, mono
 * labels, edges faded. One marquee per page.
 */
export function TrustTicker() {
  return (
    <section aria-label="Pensé pour" className="border-y border-hairline bg-canvas-soft/40 py-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="mb-4 text-center font-mono text-[0.66rem] uppercase tracking-[0.28em] text-faint">
          Pensé pour les équipes qui veulent montrer vite et vendre mieux
        </p>
        <div className="mask-fade-x relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-3 will-change-transform">
            {[...AUDIENCES, ...AUDIENCES].map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-muted"
              >
                <span className="h-1 w-1 rounded-full bg-accent/70" /> {a}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
