import "server-only";
import { getStorage } from "@demoforge/integrations";

/** Best-effort signed URL; returns null if storage is unreachable. */
export async function signed(key?: string | null, ttl = 3600): Promise<string | null> {
  if (!key) return null;
  try {
    return await getStorage().getUrl(key, ttl);
  } catch {
    return null;
  }
}
