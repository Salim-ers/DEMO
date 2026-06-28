import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo.js";
import { videoSchema, type Caption, type Format, type Scene, type VideoProps } from "./schema.js";
import { FORMAT_DIMS, FPS, getDurationInFrames } from "./lib/constants.js";

/**
 * Calibration example ("Lumen Pay" fintech, from the spec). It renders with
 * graceful placeholders so the Studio previews with zero assets; drop real
 * Higgsfield clips (deviceSrc) + ElevenLabs vo.wav (voiceoverSrc) + music into
 * public/ and fill the props to ship a real video.
 */
const BRAND = {
  name: "Lumen Pay",
  primary: "#6C5CE7",
  secondary: "#00D1B2",
  bg: "#0B0B12",
  text: "#FFFFFF",
  fontFamily: "Manrope",
  siteHost: "lumenpay.io",
} as const;

const EXAMPLE_SCENES: Scene[] = [
  {
    type: "hook",
    durationInFrames: 210,
    transitionToNext: "slide",
    deviceIsVideo: false,
    title: "Vos paiements B2B mettent encore trois jours à arriver.",
    subtitle: "Pendant ce temps, votre trésorerie attend.",
  },
  {
    type: "feature",
    durationInFrames: 300,
    transitionToNext: "fade",
    deviceIsVideo: false,
    eyebrow: "Temps réel",
    title: "Suivez chaque paiement, en direct.",
    benefit: "Plus de zones d'ombre, plus de relances oubliées.",
    cursorTarget: { x: 0.62, y: 0.42 },
  },
  {
    type: "feature",
    durationInFrames: 300,
    transitionToNext: "wipe",
    deviceIsVideo: false,
    eyebrow: "Automatique",
    title: "La réconciliation se fait toute seule.",
    benefit: "Vos écritures se rapprochent sans intervention.",
  },
  {
    type: "stats",
    durationInFrames: 270,
    transitionToNext: "fade",
    title: "Le résultat, en chiffres.",
    stats: [
      { value: 98, prefix: "-", suffix: " %", label: "de délai en moins" },
      { value: 12000, prefix: "", suffix: "+", label: "entreprises" },
      { value: 4.9, prefix: "", suffix: "/5", label: "satisfaction" },
    ],
  },
  {
    type: "cta",
    durationInFrames: 210,
    transitionToNext: "none",
    headline: "Encaissez plus vite, dès aujourd'hui.",
    buttonLabel: "Essayer Lumen Pay",
    url: "lumenpay.io",
  },
];

/** Sample word-timed captions for the first line (demo without a real VO). */
const EXAMPLE_CAPTIONS: Caption[] = [
  { word: "Vos", startMs: 250, endMs: 550 },
  { word: "paiements", startMs: 550, endMs: 1050 },
  { word: "B2B", startMs: 1050, endMs: 1450 },
  { word: "mettent", startMs: 1450, endMs: 1850 },
  { word: "trois", startMs: 1950, endMs: 2350 },
  { word: "jours", startMs: 2350, endMs: 2800 },
  { word: "à", startMs: 2800, endMs: 2950 },
  { word: "arriver.", startMs: 2950, endMs: 3600 },
];

function propsFor(format: Format): VideoProps {
  return {
    brand: { ...BRAND },
    format,
    scenes: EXAMPLE_SCENES,
    musicDuckingDb: -20,
    captions: EXAMPLE_CAPTIONS,
  };
}

const COMPOSITIONS: { id: string; format: Format }[] = [
  { id: "Demo-16x9", format: "16:9" },
  { id: "Demo-9x16", format: "9:16" },
  { id: "Demo-1x1", format: "1:1" },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {COMPOSITIONS.map(({ id, format }) => {
        const dims = FORMAT_DIMS[format];
        return (
          <Composition
            key={id}
            id={id}
            component={DemoVideo}
            schema={videoSchema}
            defaultProps={propsFor(format)}
            fps={FPS}
            width={dims.width}
            height={dims.height}
            durationInFrames={getDurationInFrames(EXAMPLE_SCENES)}
            calculateMetadata={({ props }) => ({
              durationInFrames: getDurationInFrames(props.scenes),
              width: FORMAT_DIMS[props.format].width,
              height: FORMAT_DIMS[props.format].height,
            })}
          />
        );
      })}
    </>
  );
};
