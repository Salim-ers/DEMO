import type { JobName } from "./constants.js";

export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "skipped";

export interface JobState {
  name: JobName;
  status: JobStatus;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
  attempts?: number;
}

export interface ExportBundle {
  videoMp4Key?: string;
  video916Key?: string;
  video11Key?: string;
  storyboardJsonKey?: string;
  scriptMdKey?: string;
  captionsSrtKey?: string;
  captionsVttKey?: string;
  assetsZipKey?: string;
}

/** Minimal context shared across pipeline stages so each job is self-contained. */
export interface ProjectContext {
  projectId: string;
  productName: string;
  url: string;
  targetAudience: string;
  mainPromise: string;
  tone: string;
  language: string;
  durationSeconds: number;
  format: "16:9" | "9:16" | "1:1";
}
