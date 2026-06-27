import { Play } from "lucide-react";
import { Reveal } from "../motion/reveal.js";

const FORMATS: { ratio: string; aspect: string; name: string; use: string; w: string }[] = [
  { ratio: "16:9", aspect: "aspect-video", name: "Paysage", use: "Site, landing page, sales deck, YouTube.", w: "w-full" },
  { ratio: "9:16", aspect: "aspect-[9/16]", name: "Vertical", use: "TikTok, Reels, Shorts, Stories.", w: "w-full max-w-[150px]" },
  { ratio: "1:1", aspect: "aspect-square", name: "Carré", use: "Feed LinkedIn, Instagram, posts.", w: "w-full max-w-[230px]" },
];

export function FormatsSection() {
  return (
    <section className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Formats</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Trois formats, une seule vidéo.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Le même produit, recadré et rythmé pour chaque plateforme. Vous publiez partout sans tout refaire.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-1 items-end gap-6 sm:grid-cols-3" stagger>
          {FORMATS.map((f) => (
            <div key={f.ratio} className="flex flex-col items-center text-center">
              <div className={`relative grid place-items-center ${f.w} ${f.aspect} group overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-glow`}>
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(198,134,66,0.14),transparent_60%)]" />
                <span className="grid h-12 w-12 place-items-center rounded-full bg-bronze-sheen text-studio shadow-glow-accent transition-transform duration-300 group-hover:scale-105">
                  <Play size={18} className="ml-0.5" fill="currentColor" />
                </span>
                <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-champagne">{f.ratio}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold text-ink">{f.name}</h3>
              <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-muted">{f.use}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
