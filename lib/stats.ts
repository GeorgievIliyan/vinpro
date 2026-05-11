// storage key
const STATS_KEY = 'vin_stats'

export interface VinStats {
  totalLookups: number
  savedReports: number
  checksToday: number
  stolenAlerts: number
  lastResetDate: string
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getStats(): VinStats {
  if (typeof window === 'undefined') {
    return {
      totalLookups: 0,
      savedReports: 0,
      checksToday: 0,
      stolenAlerts: 0,
      lastResetDate: todayString(),
    }
  }

  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) throw new Error('no data')
    const parsed: VinStats = JSON.parse(raw)

    // reset daily counter
    if (parsed.lastResetDate !== todayString()) {
      parsed.checksToday = 0
      parsed.lastResetDate = todayString()
      localStorage.setItem(STATS_KEY, JSON.stringify(parsed))
    }

    return parsed
  } catch {
    const defaults: VinStats = {
      totalLookups: 0,
      savedReports: 0,
      checksToday: 0,
      stolenAlerts: 0,
      lastResetDate: todayString(),
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(defaults))
    return defaults
  }
}

function saveStats(stats: VinStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  // trigger a new event
  window.dispatchEvent(new Event('vin-stats-updated'))
}

export function incrementLookup(isStolen: boolean = false): void {
  const stats = getStats()
  stats.totalLookups += 1
  stats.checksToday += 1
  if (isStolen) stats.stolenAlerts += 1
  saveStats(stats)
}

export function incrementSavedReports(): void {
  const stats = getStats()
  stats.savedReports += 1
  saveStats(stats)
}