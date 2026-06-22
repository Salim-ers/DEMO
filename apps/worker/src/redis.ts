import { Redis } from "ioredis";

/**
 * Shared Redis connection for BullMQ. `maxRetriesPerRequest: null` is required
 * by BullMQ for blocking commands.
 */
export function createRedis(): Redis {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  return new Redis(url, { maxRetriesPerRequest: null });
}
