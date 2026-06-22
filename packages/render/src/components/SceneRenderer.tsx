import React from "react";
import { AbsoluteFill } from "remotion";
import type { RenderScene } from "@demoforge/shared";
import type { Theme } from "../theme.js";
import { ScreenCapture } from "./ScreenCapture.js";
import { TitleCard } from "./TitleCard.js";
import { BenefitCard } from "./BenefitCard.js";
import { Outro } from "./Outro.js";
import { Transition } from "./Transition.js";

export interface SceneRendererProps {
  scene: RenderScene;
  productName: string;
  mainPromise: string;
  theme: Theme;
  width: number;
  height: number;
  scale: number;
}

/**
 * Dispatch a single storyboard scene to the correct visual component. The
 * voiceover/caption text lives on the scene; visualInstruction carries the
 * human-readable copy used for statement cards.
 */
export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene, productName, mainPromise, theme, width, height, scale,
}) => {
  switch (scene.type) {
    case "title_card":
      return <TitleCard productName={productName} promise={scene.visualInstruction || mainPromise} theme={theme} scale={scale} />;

    case "benefit_card":
      return <BenefitCard kicker={scene.captionText || deriveKicker(scene)} heading={scene.visualInstruction} theme={theme} scale={scale} />;

    case "transition":
      return <Transition label={scene.visualInstruction || "Next"} theme={theme} scale={scale} />;

    case "outro":
      return <Outro productName={productName} cta={scene.visualInstruction || mainPromise} theme={theme} scale={scale} />;

    case "screen_capture":
    case "zoom":
    case "higgsfield_broll":
    default:
      return (
        <ScreenCapture
          imageUrl={scene.imageUrl}
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

function deriveKicker(scene: RenderScene): string | undefined {
  const t = scene.visualInstruction.toLowerCase();
  if (t.includes("roi") || t.includes("return")) return "Proof";
  if (t.includes("problem") || t.includes("challenge")) return "The problem";
  return "Why it matters";
}

/** Fallback wrapper kept for safety if a scene type is ever unknown. */
export const EmptyScene: React.FC<{ theme: Theme }> = ({ theme }) => (
  <AbsoluteFill style={{ background: theme.bg }} />
);
