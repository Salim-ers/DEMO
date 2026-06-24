import { describe, it, expect } from "vitest";
import { buildStoryboardFallback } from "../fallback.js";
import { storyboardSchema, type ProjectContext, type Scenario, type CaptureStepResult } from "@studio-one/shared";

const ctx: ProjectContext = {
  projectId: "p1", productName: "Northwind CRM", url: "https://app.northwind.example",
  targetAudience: "RevOps leaders", mainPromise: "See which accounts to act on first.",
  tone: "sales", language: "en", durationSeconds: 60, format: "16:9",
};
const scenario: Scenario = {
  raw: "Show the dashboard, create a customer, open analytics, finish on ROI.",
  steps: [{ intent: "open dashboard" }, { intent: "create a customer" }, { intent: "show analytics" }],
};
const captures: CaptureStepResult[] = [
  {
    index: 0, intent: "open dashboard", url: "https://app.northwind.example/dashboard", status: "ok",
    screenshotAssetKey: "shots/0.png", startedAt: "t", finishedAt: "t",
    metadata: { url: "x", title: "Dashboard", headings: ["Pipeline"], visibleButtons: ["New customer"], primaryText: [] },
  },
  {
    index: 1, intent: "show analytics", url: "https://app.northwind.example/analytics", status: "ok",
    screenshotAssetKey: "shots/1.png", startedAt: "t", finishedAt: "t",
    metadata: { url: "x", title: "Analytics", headings: ["Trends"], visibleButtons: ["Export"], primaryText: [] },
  },
];

describe("storyboard fallback", () => {
  it("produces a schema-valid storyboard grounded in captures", () => {
    const sb = buildStoryboardFallback(ctx, scenario, captures);
    expect(() => storyboardSchema.parse(sb)).not.toThrow();
    // Title card first, outro last.
    expect(sb.scenes[0]!.type).toBe("title_card");
    expect(sb.scenes.at(-1)!.type).toBe("outro");
    // Uses the captured asset keys.
    const capScenes = sb.scenes.filter((s) => s.type === "screen_capture");
    expect(capScenes.map((s) => s.sourceAssetId)).toContain("shots/0.png");
  });

  it("avoids banned hype phrases", () => {
    const sb = buildStoryboardFallback(ctx, scenario, captures);
    const all = sb.scenes.map((s) => s.voiceoverText).join(" ").toLowerCase();
    for (const banned of ["revolutionary", "incredible", "welcome to", "game-changing"]) {
      expect(all).not.toContain(banned);
    }
  });

  it("distributes durations toward the target", () => {
    const sb = buildStoryboardFallback(ctx, scenario, captures);
    const total = sb.scenes.reduce((a, s) => a + s.durationMs, 0);
    expect(total).toBeGreaterThan(40_000);
  });
});
