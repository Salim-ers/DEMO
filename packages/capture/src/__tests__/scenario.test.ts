import { describe, it, expect } from "vitest";
import { heuristicSteps } from "../scenario.js";

describe("heuristic scenario parser", () => {
  it("splits a natural sentence into ordered steps with url hints", () => {
    const steps = heuristicSteps(
      "Show the dashboard first, then create a customer, then open analytics, and finish on the ROI.",
    );
    expect(steps.length).toBeGreaterThanOrEqual(4);
    expect(steps[0]!.urlHint).toBe("/dashboard");
    expect(steps.some((s) => s.urlHint === "/analytics")).toBe(true);
    expect(steps.some((s) => s.urlHint === "/reports/roi")).toBe(true);
    const create = steps.find((s) => /create a customer/i.test(s.intent));
    expect(create?.actionHints?.length).toBeGreaterThan(0);
  });
});
