import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Reveal } from "../motion/reveal.js";
import { Magnetic } from "../motion/magnetic.js";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-hairline bg-canvas">
      <div aria-hidden className="glow-orb absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/3 bg-[radial-gradient(closest-side,rgba(198,134,66,0.26),transparent)]" />
      <div aria-hidden className="grain absolute inset-0" />

      <div className="relative mx-auto max-w-4xl px-5 py-32 text-center sm:px-8 sm:py-40">
        <Reveal>
          <p className="eyebrow justify-center">Prêt à produire</p>
          <h2 className="text-display mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.2rem,5vw,4rem)] text-ink">
            Votre prochaine démo ne doit pas ressembler à un{" "}
            <span className="editorial text-champagne">PowerPoint.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Transformez votre produit en vidéo prête à vendre. 10 vidéos par mois, sans montage manuel.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic strength={0.45}>
              <Link href="/new" className="btn-primary px-7 py-4 text-base">
                Créer ma première vidéo <ArrowRight size={18} />
              </Link>
            </Magnetic>
            <Link href="/demo" className="btn-secondary px-6 py-4 text-base">
              <Play size={16} fill="currentColor" /> Voir un exemple
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
