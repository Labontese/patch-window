export interface SiteStats {
  currentPatch: string
  siteStartedAt: Date
}

export const SITE_STATS: SiteStats = {
  currentPatch: 'v2.0.0',
  // First commit: 2026-04-16
  siteStartedAt: new Date('2026-04-16'),
}

/** Returns uptime in days since siteStartedAt */
export function getSiteUptimeDays(): number {
  const ms = Date.now() - SITE_STATS.siteStartedAt.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}
