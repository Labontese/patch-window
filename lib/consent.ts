'use client'

import { useState, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ConsentRecord {
  analytics: boolean
  timestamp: string // ISO 8601
  version: '1.0'
}

export interface ConsentState {
  /** null = no decision yet (or TTL expired) */
  analytics: boolean | null
  hasDecided: boolean
  setAnalytics: (val: boolean) => void
  openBanner: () => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'pw-consent'
const CONSENT_VERSION = '1.0'
const TTL_MS = 365 * 24 * 60 * 60 * 1000 // 12 months

// Custom event dispatched when consent changes so ConsentBanner + layout
// can react without prop-drilling through the full tree.
export const CONSENT_CHANGE_EVENT = 'pw:consent-change'
export const BANNER_OPEN_EVENT = 'pw:banner-open'

// ---------------------------------------------------------------------------
// Low-level utilities (safe to call in SSR guard — always check window)
// ---------------------------------------------------------------------------

function readStorage(): ConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentRecord
  } catch {
    return null
  }
}

function isExpired(record: ConsentRecord): boolean {
  try {
    const age = Date.now() - new Date(record.timestamp).getTime()
    return age > TTL_MS
  } catch {
    return true
  }
}

function isCurrentVersion(record: ConsentRecord): boolean {
  return record.version === CONSENT_VERSION
}

/**
 * setConsent — writes to localStorage, dispatches CONSENT_CHANGE_EVENT.
 * Safe to import and call outside React components.
 */
export function setConsent(analytics: boolean): void {
  if (typeof window === 'undefined') return
  const record: ConsentRecord = {
    analytics,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }))
}

/**
 * clearConsent — removes pw-consent, clears Umami's own localStorage entries,
 * then dispatches CONSENT_CHANGE_EVENT with analytics=false.
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  // Clean up Umami's storage entries so no residual data remains.
  // Umami v3.1 (current) only writes 'umami.disabled' (opt-out flag) — the
  // session cache lives in JS memory, not localStorage. The 'umami.cache'
  // removal is defensive in case earlier/future versions write that key.
  localStorage.removeItem('umami.cache')
  localStorage.removeItem('umami.disabled')
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGE_EVENT, {
      detail: { analytics: false, timestamp: new Date().toISOString(), version: CONSENT_VERSION },
    }),
  )
}

/**
 * getEffectiveConsent — reads current consent state without React.
 * Returns null when no valid, non-expired decision exists.
 */
export function getEffectiveConsent(): boolean | null {
  const record = readStorage()
  if (!record) return null
  if (!isCurrentVersion(record)) return null
  if (isExpired(record)) return null
  return record.analytics
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConsent(): ConsentState {
  // Lazy initializer runs once on mount — avoids setState-in-effect-body lint error.
  // On the server, window is undefined so getEffectiveConsent returns null (safe).
  const [analytics, setAnalyticsState] = useState<boolean | null>(() => getEffectiveConsent())
  const [hasDecided, setHasDecided] = useState<boolean>(() => getEffectiveConsent() !== null)

  // Keep state in sync with external changes (other tabs, footer button, etc.)
  // setState here is inside an event callback, not directly in the effect body.
  useEffect(() => {
    function handleChange(e: Event) {
      const detail = (e as CustomEvent<ConsentRecord>).detail
      if (detail && typeof detail.analytics === 'boolean') {
        setAnalyticsState(detail.analytics)
        setHasDecided(true)
      }
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange)
  }, [])

  const setAnalytics = useCallback((val: boolean) => {
    setConsent(val)
  }, [])

  const openBanner = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(BANNER_OPEN_EVENT))
    }
  }, [])

  return { analytics, hasDecided, setAnalytics, openBanner }
}
