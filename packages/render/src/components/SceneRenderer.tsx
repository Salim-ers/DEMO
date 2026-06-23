import React from "react";
import { AbsoluteFill } from "remotion";
import type { RenderScene } from "@demoforge/shared";
import type { Theme } from "../theme.js";
import { ScreenCapture } from "./ScreenCapture.js";
import { TitleCard } from "./TitleCard.js";
import { BenefitCard } from "./BenefitCard.js";
import { Outro } from "./Outro.js";
import { Transition } from "./Transition.js";
import { PromiseCard } from "./PromiseCard.js";
import { BenefitGrid, type BenefitItem } from "./BenefitGrid.js";
import { MetricMoment } from "./MetricMoment.js";
import { WorkflowMap } from "./WorkflowMap.js";

export interface SceneRendererProps {
  scene: RenderScene;
  productName: string;
  mainPromise: string;
  logoUrl?: string | null;
  siteHost?: string;
  theme: Theme;
  width: number;
  height: number;
  scale: number;
}

/**
 * Dispatch a single storyboard scene to the correct visual component. Statement
 * scenes carry their copy in `visualInstruction`; structured beats (grids, maps,
 * metrics) encode their payload there too, using a small "a | b" / "value::label"
 * convention parsed below — so no schema change is needed to carry their content.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene, productName, mainPromise, logoUrl, siteHost, theme, width, height, scale,
}) => {
  const accentWords = productName.split(/\s+/).filter(Boolean);

  switch (scene.type) {
    case "title_card":
    case "cinematic_intro":
      return <TitleCard productName={productName} promise={scene.visualInstruction || mainPromise} logoUrl={logoUrl} theme={theme} scale={scale} />;

    case "promise_card":
      return <PromiseCard heading={scene.visualInstruction || mainPromise} kicker={scene.captionText || undefined} accentWords={accentWords} theme={theme} scale={scale} />;

    case "benefit_card":
    case "problem_motion_card":
      return <BenefitCard kicker={scene.captionText || deriveKicker(scene)} heading={scene.visualInstruction} theme={theme} scale={scale} />;

    case "benefit_grid":
      return <BenefitGrid items={parseItems(scene.visualInstruction)} kicker={scene.captionText || undefined} theme={theme} scale={scale} />;

    case "metric_moment": {
      const m = parseMetric(scene.visualInstruction);
      return <MetricMoment value={m.value} label={m.label} kicker={scene.captionText || undefined} theme={theme} scale={scale} />;
    }

    case "workflow_map":
      return <WorkflowMap nodes={parseNodes(scene.visualInstruction)} kicker={scene.captionText || undefined} theme={theme} scale={scale} />;

    case "transition":
      return <Transition label={scene.visualInstruction || "Next"} theme={theme} scale={scale} />;

    case "outro":
    case "final_cta":
      return <Outro productName={productName} cta={scene.visualInstruction || mainPromise} logoUrl={logoUrl} host={siteHost} theme={theme} scale={scale} />;

    case "screen_capture":
    case "product_stage":
    case "product_zoom":
    case "feature_callout":
    case "zoom":
    case "higgsfield_broll":
    default:
      return (
        <ScreenCapture
          imageUrl={scene.imageUrl}
          url={siteHost}
          caption={scene.captionText}
          callouts={scene.callouts}
          cameraMotion={scene.cameraMotion}
          highlight={scene.highlight ?? null}
          theme={theme}
          width={width}
          height={height}
          scale={scale}
        />
      );
  }
};

/** "Soins | Planning | Documents" → ["Soins","Planning","Documents"]. */
function parseNodes(s: string): string[] {
  return s.split("|").map((x) => x.trim()).filter(Boolean);
}

/** "value::label | value::label" or "label | label" → BenefitItem[]. */
function parseItems(s: string): BenefitItem[] {
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((part) => {
      const [a, b] = part.split("::").map((y) => y.trim());
      if (b) {
        const num = Number(a);
        return Number.isFinite(num) && /^-?\d/.test(a!) ? { value: num, label: b } : { value: a, label: b };
      }
      return { label: a! };
    });
}

/** "−40%::de temps administratif" → { value, label }. */
function parseMetric(s: string): { value: number | string; label: string } {
  const [a, b] = s.split("::").map((y) => y.trim());
  if (b) {
    const num = Number(a);
    return { value: Number.isFinite(num) && /^-?\d/.test(a!) ? num : a!, label: b };
  }
  return { value: "", label: a ?? s };
}

function deriveKicker(scene: RenderScene): string | undefined {
  const t = scene.visualInstruction.toLowerCase();
  if (t.includes("roi") || t.includes("return")) return "Proof";
  if (t.includes("problem") || t.includes("challenge") || t.includes("problème")) return "Le problème";
  return "Why it matters";
}

/** Fallback wrapper kept for safety if a scene type is ever unknown. */
export const EmptyScene: React.FC<{ theme: Theme }> = ({ theme }) => (
  <AbsoluteFill style={{ background: theme.bg }} />
);
