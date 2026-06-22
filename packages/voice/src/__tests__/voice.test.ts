import { describe, it, expect } from "vitest";
import { buildVoiceScript, voiceScriptToMarkdown } from "../index.js";
import type { ProjectContext, Storyboard } from "@demoforge/shared";

const ctx: ProjectContext = {
  projectId: "p1", productName: "Northwind CRM", url: "https://app.northwind.example",
  targetAudience: "RevOps", mainPromise: "Act on the right accounts first.",
  tone: "sales", language: "en", durationSeconds: 30, format: "16:9",
};
const storyboard: Storyboard = {
  title: "t", targetAudience: "RevOps", durationSeconds: 30,
  scenes: [
    { id: "s1", type: "title_card", visualInstruction: "", voiceoverText: "Act on the right accounts first.", captionText: "Northwind", durationMs: 3000, cameraMotion: "none", callouts: [] },
    { id: "s2", type: "screen_capture", sourceAssetId: "a.png", visualInstruction: "", voiceoverText: "Here you open the dashboard.", captionText: "Dashboard", durationMs: 5000, cameraMotion: "slow_zoom_in", callouts: [] },
  ],
};

describe("voice script", () => {
  it("aligns lines to scenes with contiguous timing", async () => {
    const s = await buildVoiceScript({ ctx, storyboard, mode: "script_only" });
    expect(s.lines).toHaveLength(2);
    expect(s.lines[0]!.startMs).toBe(0);
    expect(s.lines[0]!.endMs).toBe(3000);
    expect(s.lines[1]!.startMs).toBe(3000);
    expect(s.consentConfirmed).toBe(true); // script_only needs no extra consent
  });

  it("does not auto-confirm consent for TTS", async () => {
    const s = await buildVoiceScript({ ctx, storyboard, mode: "tts_provider", ttsProvider: "elevenlabs" });
    expect(s.consentConfirmed).toBe(false);
    expect(s.ttsProvider).toBe("elevenlabs");
  });

  it("renders markdown", async () => {
    const s = await buildVoiceScript({ ctx, storyboard, mode: "script_only" });
    expect(voiceScriptToMarkdown(ctx, s)).toContain("# Voiceover script — Northwind CRM");
  });
});
