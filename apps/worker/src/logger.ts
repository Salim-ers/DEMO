import { pino } from "pino";

/**
 * Structured logger. Pretty in dev; JSON in prod. A redaction list ensures
 * credentials never reach the logs even if accidentally passed in a payload.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: ["password", "*.password", "creds.password", "email", "*.email", "secret", "*.secret", "apiKey", "*.apiKey"],
    censor: "[redacted]",
  },
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" } },
});

export function jobLogger(projectId: string, renderJobId: string) {
  return logger.child({ projectId, renderJobId });
}
