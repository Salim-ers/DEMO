import http from "node:http";
import { logger } from "./logger.js";

export interface HealthState {
  redis: boolean;
  db: boolean;
  activeJobs: number;
  lastJobAt: Date | null;
}

/**
 * Tiny HTTP server exposing GET /health for Railway/Render health checks and
 * uptime monitors. Returns 200 while Redis + DB are reachable, 503 otherwise.
 * Binds to $PORT (Railway injects it) so the platform can route health probes.
 */
export function startHealthServer(getState: () => HealthState): http.Server {
  const port = Number(process.env.PORT ?? process.env.HEALTH_PORT ?? "8080");

  const server = http.createServer((req, res) => {
    if (req.method === "GET" && (req.url === "/health" || req.url === "/healthz" || req.url === "/")) {
      const s = getState();
      const healthy = s.redis && s.db;
      res.writeHead(healthy ? 200 : 503, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          status: healthy ? "ok" : "degraded",
          redis: s.redis,
          db: s.db,
          activeJobs: s.activeJobs,
          lastJobAt: s.lastJobAt?.toISOString() ?? null,
          uptimeSeconds: Math.round(process.uptime()),
        }),
      );
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  server.listen(port, () => logger.info({ port }, "health server listening on /health"));
  server.on("error", (err) => logger.error({ err: String(err) }, "health server error"));
  return server;
}
