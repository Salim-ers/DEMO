"use client";
import { Globe, Target, ListChecks, AudioLines, Sparkles, Clapperboard, Download } from "lucide-react";
import RadialOrbitalTimeline, { type TimelineItem } from "../ui/radial-orbital-timeline.js";

/**
 * The Studio One engine, as a living orbital map. Each node is a real stage of
 * the pipeline — click one to read exactly what happens and how it connects to
 * the next. The background plays a clip dropped in `public/hero`.
 */

// To use your own clip: drop the file in `apps/web/public/hero/` and point this
// path at it (e.g. "/hero/ma-video.mp4").
const HERO_VIDEO = "/hero/10171526-uhd_3840_2160_24fps.mp4";

const PIPELINE: TimelineItem[] = [
  {
    id: 1,
    title: "Analyse du site",
    date: "Capture réelle",
    category: "Entrée",
    icon: Globe,
    content:
      "Studio One lit votre URL, capture les écrans clés et extrait votre offre, votre audience et vos messages forts.",
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Stratégie",
    date: "Angle & format",
    category: "Cadrage",
    icon: Target,
    content:
      "Objectif marketing, angle, format, durée, ton et appel à l'action sont définis pour cibler la bonne audience.",
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Storyboard",
    date: "Scène par scène",
    category: "Écriture",
    icon: ListChecks,
    content:
      "Chaque plan est découpé : message, écran utilisé, mouvement de caméra, voix off et sous-titre. Rien n'est laissé au hasard.",
    relatedIds: [2, 4],
    status: "completed",
    energy: 82,
  },
  {
    id: 4,
    title: "Voix off",
    date: "ElevenLabs",
    category: "Audio",
    icon: AudioLines,
    content:
      "Une voix off naturelle est générée à partir du script, puis calée sur le rythme du montage.",
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 68,
  },
  {
    id: 5,
    title: "Plans IA",
    date: "Higgsfield",
    category: "B-roll",
    icon: Sparkles,
    content:
      "Des b-rolls et plans cinématiques générés par IA viennent enrichir vos captures d'écran réelles.",
    relatedIds: [4, 6],
    status: "in-progress",
    energy: 60,
  },
  {
    id: 6,
    title: "Montage",
    date: "Remotion",
    category: "Assemblage",
    icon: Clapperboard,
    content:
      "Zooms intelligents, transitions propres, captions dynamiques et musique sont assemblés au rythme social-first.",
    relatedIds: [5, 7],
    status: "in-progress",
    energy: 48,
  },
  {
    id: 7,
    title: "Exports",
    date: "16:9 · 9:16 · 1:1",
    category: "Livraison",
    icon: Download,
    content:
      "Votre vidéo prête à publier est exportée dans les trois formats, avec script et sous-titres inclus.",
    relatedIds: [6],
    status: "pending",
    energy: 32,
  },
];

export function PipelineOrbit() {
  return (
    <section id="pipeline" className="relative bg-canvas">
      <RadialOrbitalTimeline
        timelineData={PIPELINE}
        videoSrc={HERO_VIDEO}
        header={
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow justify-center">Le pipeline en orbite</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink">
              Chaque étape du moteur, en un coup d'œil.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
              Cliquez sur une étape pour voir précisément ce que fait Studio One — et comment elle s'enchaîne avec la
              suivante.
            </p>
          </div>
        }
      />
    </section>
  );
}
