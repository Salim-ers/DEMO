/**
 * `pnpm render:example` — end-to-end, no browser required.
 *
 * Builds a storyboard + voiceover + captions from a small example capture set
 * (deterministic, offline), writes the export artifacts, then renders a real
 * MP4 with Remotion. This is the smallest honest proof that the render pipeline
 * runs on a fresh machine after `pnpm install`.
 */
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import {
  type ProjectContext, type Scenario, type CaptureStepResult,
  buildSRT, buildVTT, RENDER_DEFAULTS,
} from "@demoforge/shared";
import { generateStoryboard } from "@demoforge/storyboard";
import { buildVoiceScript, voiceScriptToMarkdown } from "@demoforge/voice";
import { storyboardToRenderProps } from "./map.js";
import { renderDemoVideo } from "./render.js";

const OUT = path.resolve(process.cwd(), "out");

const ctx: ProjectContext = {
  projectId: "demo_project",
  productName: "Northwind CRM",
  url: "https://northwind.example.com",
  targetAudience: "RevOps leaders at 50–500 person B2B SaaS companies",
  mainPromise: "Close more deals with less busywork.",
  tone: "premium",
  language: "en",
  durationSeconds: 60,
  format: "16:9",
};

const scenario: Scenario = {
  raw: "Show the dashboard, then create a customer, then show analytics, then end on ROI.",
  steps: [
    { intent: "open dashboard", urlHint: "/dashboard" },
    { intent: "create customer", actionHints: ["click New customer"] },
    { intent: "show analytics", urlHint: "/analytics" },
  ],
};

// Example captures. imageUrl is resolved as null below, so capture scenes render
// the graceful placeholder; a real run supplies signed screenshot URLs.
const captures: CaptureStepResult[] = [
  {
    index: 0, intent: "open dashboard", url: "https://northwind.example.com/dashboard",
    status: "ok", screenshotAssetKey: "captures/demo/0-desktop.png",
    metadata: { url: "/dashboard", title: "Dashboard", headings: ["Pipeline"], visibleButtons: ["New customer"], primaryText: [] },
    startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
  },
  {
    index: 1, intent: "create customer", url: "https://northwind.example.com/customers/new",
    status: "ok", screenshotAssetKey: "captures/demo/1-desktop.png",
    metadata: { url: "/customers/new", title: "New customer", headings: ["Add customer"], visibleButtons: ["Save"], primaryText: [] },
    startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
  },
  {
    index: 2, intent: "show analytics", url: "https://northwind.example.com/analytics",
    status: "ok", screenshotAssetKey: "captures/demo/2-desktop.png",
    metadata: { url: "/analytics", title: "Analytics", headings: ["Conversion"], visibleButtons: ["Export"], primaryText: [] },
    startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  const { storyboard, source } = await generateStoryboard(ctx, scenario, captures);
  console.log(`• storyboard ready (${source}) — ${storyboard.scenes.length} scenes`);

  const voice = await buildVoiceScript({ ctx, storyboard, mode: "script_only" });
  const srt = buildSRT(voice.lines);
  const vtt = buildVTT(voice.lines);

  await Promise.all([
    writeFile(path.join(OUT, "storyboard.json"), JSON.stringify(storyboard, null, 2)),
    writeFile(path.join(OUT, "script.md"), voiceScriptToMarkdown(ctx, voice)),
    writeFile(path.join(OUT, "captions.srt"), srt),
    writeFile(path.join(OUT, "captions.vtt"), vtt),
  ]);
  console.log(`• wrote storyboard.json, script.md, captions.srt, captions.vtt -> ${OUT}`);

  const props = storyboardToRenderProps(ctx, storyboard, {
    fps: RENDER_DEFAULTS.fps,
    accentColor: "#6366F1",
    audioUrl: null,
    resolveImageUrl: () => null, // example has no hosted screenshots
  });
  await writeFile(path.join(OUT, "render-props.json"), JSON.stringify(props, null, 2));

  const outPath = path.join(OUT, "demo.mp4");
  console.log("• rendering MP4 (this spins up a headless Chromium via Remotion)…");
  await renderDemoVideo({
    props,
    outPath,
    onProgress: (p) => process.stdout.write(`\r  render ${Math.round(p * 100)}%   `),
  });
  process.stdout.write("\n");
  console.log(`✓ done — ${outPath}`);
}

main().catch((err) => {
  console.error("render:example failed:", err);
  process.exit(1);
});
