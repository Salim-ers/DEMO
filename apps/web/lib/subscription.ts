import { prisma } from "./db.js";
import { PLAN } from "./pricing.js";

export interface SubscriptionUsage {
  planName: string;
  monthlyPrice: number;
  includedVideos: number;
  usedVideosThisMonth: number;
  remaining: number;
  /** 0..1 share of the monthly quota consumed. */
  ratio: number;
  /** ISO date of the next renewal (first day of next month). */
  renewalDate: string;
  /** e.g. "1 juillet". */
  renewalLabel: string;
}

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/**
 * Real usage for the current billing month, derived from projects created this
 * month in the active workspace. There is no billing backend yet, so the quota
 * is computed honestly from the data we have rather than faked.
 */
export async function getSubscriptionUsage(workspaceId: string): Promise<SubscriptionUsage> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const renewal = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const usedVideosThisMonth = await prisma.project.count({
    where: { workspaceId, createdAt: { gte: monthStart }, archivedAt: null },
  });

  const remaining = Math.max(0, PLAN.includedVideos - usedVideosThisMonth);
  return {
    planName: PLAN.name,
    monthlyPrice: PLAN.monthlyPrice,
    includedVideos: PLAN.includedVideos,
    usedVideosThisMonth,
    remaining,
    ratio: Math.min(1, usedVideosThisMonth / PLAN.includedVideos),
    renewalDate: renewal.toISOString(),
    renewalLabel: `${renewal.getDate()} ${MONTHS_FR[renewal.getMonth()]}`,
  };
}
