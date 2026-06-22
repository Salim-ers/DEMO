import { Redis } from "ioredis";

/**
 * Shared Redis connection for BullMQ. `maxRetriesPerRequest: null` is required
 * by BullMQ for blocking commands.
 *
 * `family: 0` lets ioredis resolve both IPv4 and IPv6. Railway's private
 * network (`redis.railway.internal`) is IPv6-only, so without this the worker
 * fails with ENOTFOUND/ECONNREFUSED at startup. It's a no-op for normal
 * IPv4 Redis (Upstash, public proxy URLs, localhost).
 */
/** Resolved Redis URL. An empty string (e.g. an unresolved Railway reference)
 *  must NOT silently fall back to localhost, so trim-then-`||` treats "" as unset. */
export function redisUrl(): string {
  return process.env.REDIS_URL?.trim() || "redis://localhost:6379";
}

export function createRedis(): Redis {
  return new Redis(redisUrl(), { maxRetriesPerRequest: null, family: 0 });
}
