"use client";
import { gsap, ScrollTrigger } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";

const PHASES = [
  { n: "01", title: "Analyse du site", text: "Lecture de l'URL, captures des écrans clés, extraction de la proposition de valeur et de l'audience." },
  { n: "02", title: "Stratégie vidéo", text: "Objectif marketing, format, durée, ton, angle et appel à l'action." },
  { n: "03", title: "Storyboard", text: "Découpage scène par scène : message, écran utilisé, mouvement de caméra, voix off, sous-titre." },
  { n: "04", title: "Production", text: "Plans IA, voix off, captions, transitions, musique, puis exports en 16:9, 9:16 et 1:1." },
];

type Clip = { l: number; w: number };
const TRACKS: { label: string; rgb: string; clips: Clip[] }[] = [
  { label: "Écrans", rgb: "198,134,66", clips: [{ l: 1, w: 17 }, { l: 22, w: 20 }, { l: 48, w: 15 }, { l: 68, w: 26 }] },
  { label: "Plans IA", rgb: "138,108,255", clips: [{ l: 16, w: 13 }, { l: 44, w: 17 }, { l: 72, w: 19 }] },
  { label: "Voix off", rgb: "85,216,255", clips: [{ l: 3, w: 35 }, { l: 41, w: 31 }, { l: 75, w: 21 }] },
  { label: "Sous-titres", rgb: "246,231,204", clips: [{ l: 5, w: 11 }, { l: 20, w: 12 }, { l: 37, w: 10 }, { l: 54, w: 13 }, { l: 73, w: 12 }, { l: 90, w: 8 }] },
  { label: "Rythme", rgb: "154,147,137", clips: [{ l: 0, w: 100 }] },
];

export function EngineTimeline() {
  const ref = useGsap<HTMLDivElement>((self) => {
    const phases = gsap.utils.toArray<HTMLElement>(self.querySelectorAll(".engine-phase"));
    const clips = gsap.utils.toArray<HTMLElement>(self.querySelectorAll(".engine-clip"));
    const playhead = self.querySelector<HTMLElement>(".engine-playhead");
    const track = self.querySelector<HTMLElement>(".engine-playhead-track");
    const pin = self.querySelector<HTMLElement>(".engine-pin");
    const now = self.querySelector<HTMLElement>(".engine-now");

    const setActive = (idx: number) =>
      phases.forEach((p, i) =>
        gsap.to(p, { opacity: i === idx ? 1 : 0.3, filter: i === idx ? "blur(0px)" : "blur(2px)", duration: 0.3, overwrite: "auto" }),
      );
    const fill = (prog: number) =>
      clips.forEach((c) => gsap.set(c, { opacity: Number(c.dataset.center) <= prog * 100 ? 1 : 0.26 }));

    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(playhead, { opacity: 1, x: 0 });
      // Cache the lane width (re-read only on refresh, not every scrub frame) and
      // only re-tween the phase focus when the active index actually changes.
      let laneW = track?.offsetWidth ?? 0;
      let current = -1;
      const apply = (prog: number) => {
        const idx = Math.min(PHASES.length - 1, Math.floor(prog * PHASES.length * 0.999));
        if (idx !== current) {
          current = idx;
          setActive(idx);
        }
        fill(prog);
        if (playhead) gsap.set(playhead, { x: laneW * prog });
        if (now) now.textContent = formatTC(prog);
      };
      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=1700",
        pin: pin,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (s) => {
          laneW = track?.offsetWidth ?? laneW;
          apply(s.progress);
        },
        onUpdate: (s) => apply(s.progress),
      });
      apply(0);
      return () => st.kill();
    });

    mm.add("(max-width: 900px), (prefers-reduced-motion: reduce)", () => {
      phases.forEach((p) => gsap.set(p, { opacity: 1, filter: "none" }));
      clips.forEach((c) => gsap.set(c, { opacity: 1 }));
      if (playhead) gsap.set(playhead, { opacity: 0 });
    });
  }, []);

  return (
    <section ref={ref} id="moteur" className="grain relative bg-canvas-soft">
      <div className="engine-pin flex min-h-screen items-center overflow-hidden py-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Phases */}
          <div>
            <p className="eyebrow">Le moteur</p>
            <h2 className="text-display mt-4 text-[clamp(2rem,3.6vw,3rem)] text-ink">
              Un moteur pensé comme un monteur marketing.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Captures réelles, plans IA, zooms intelligents, transitions propres, captions dynamiques, voix off et
              rythme social-first. Chaque étape s'enchaîne comme dans un vrai studio.
            </p>

            <div className="mt-9 space-y-5">
              {PHASES.map((p) => (
                <div key={p.n} className="engine-phase flex gap-4">
                  <span className="timecode mt-0.5 text-sm text-accent-deep">{p.n}</span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight text-ink">{p.title}</h3>
                    <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NLE board */}
          <div className="edge-light relative overflow-hidden rounded-3xl border border-hairline bg-canvas/70 p-4 shadow-soft sm:p-5">
            {/* Ruler */}
            <div className="mb-3 flex items-center justify-between border-b border-hairline pb-3">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-bad" />
                <span className="timecode text-[11px] text-muted">Montage · 90 s · 16:9</span>
              </span>
              <span className="engine-now timecode text-[11px] text-accent-deep">00:00:00</span>
            </div>

            <div className="relative">
              {/* Tracks */}
              <div className="space-y-2.5">
                {TRACKS.map((t) => (
                  <div key={t.label} className="grid grid-cols-[78px_1fr] items-center gap-3">
                    <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{t.label}</span>
                    <div className="relative h-8 overflow-hidden rounded-lg border border-hairline bg-black/30">
                      {t.clips.map((c, i) => (
                        <span
                          key={i}
                          data-center={c.l + c.w / 2}
                          className="engine-clip absolute inset-y-1 rounded-md"
                          style={{
                            left: `${c.l}%`,
                            width: `${c.w}%`,
                            background: `linear-gradient(180deg, rgba(${t.rgb},0.92), rgba(${t.rgb},0.62))`,
                            boxShadow: `0 0 14px -3px rgba(${t.rgb},0.55)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Playhead overlay (aligned with the lane column) */}
              <div className="engine-playhead-track pointer-events-none absolute inset-y-0 left-[90px] right-0">
                <span className="engine-playhead absolute inset-y-0 left-0 w-[2px] bg-champagne/90 shadow-[0_0_10px_rgba(246,231,204,0.6)]">
                  <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-champagne" />
                </span>
              </div>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              Higgsfield · ElevenLabs · Remotion
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTC(progress: number): string {
  const totalCs = Math.round(progress * 90 * 100); // 90s clip, centiseconds
  const s = Math.floor(totalCs / 100);
  const cs = totalCs % 100;
  return `00:${String(s).padStart(2, "0")}:${String(cs).padStart(2, "0")}`;
}
