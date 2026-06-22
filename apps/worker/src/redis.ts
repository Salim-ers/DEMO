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
export function createRedis(): Redis {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  return new Redis(url, { maxRetriesPerRequest: null, family: 0 });
}
