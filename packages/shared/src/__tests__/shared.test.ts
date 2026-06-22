import { describe, it, expect } from "vitest";
import { buildSRT, buildVTT } from "../captions.js";
import { redactPII, msToFrames, msToSrtTime } from "../utils.js";
import { storyboardSchema } from "../schemas.js";

describe("captions", () => {
  const lines = [
    { sceneId: "s1", text: "Your team sees priorities first.", startMs: 0, endMs: 2500 },
    { sceneId: "s2", text: "Track activity and follow up faster.", startMs: 2500, endMs: 5000 },
  ];

  it("builds well-formed SRT", () => {
    const srt = buildSRT(lines);
    expect(srt).toContain("1\n00:00:00,000 --> 00:00:02,500");
    expect(srt).toContain("2\n00:00:02,500 --> 00:00:05,000");
  });

  it("builds VTT with header", () => {
    expect(buildVTT(lines).startsWith("WEBVTT")).toBe(true);
  });
});

describe("utils", () => {
  it("redacts emails and phones", () => {
    const r = redactPII("Reach me at jane.doe@acme.io or +1 (415) 555-1234");
    expect(r).not.toContain("jane.doe@acme.io");
    expect(r).not.toContain("555-1234");
  });
  it("converts ms to frames", () => {
    expect(msToFrames(1000, 30)).toBe(30);
    expect(msToFrames(0, 30)).toBe(1);
  });
  it("formats srt timecode", () => {
    expect(msToSrtTime(3_661_500)).toBe("01:01:01,500");
  });
});

describe("storyboard schema", () => {
  it("rejects an empty scenes array", () => {
    const res = storyboardSchema.safeParse({
      title: "x", targetAudience: "y", durationSeconds: 30, scenes: [],
    });
    expect(res.success).toBe(false);
  });
});
