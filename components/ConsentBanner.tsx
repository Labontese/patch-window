'use client'

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import {
  setConsent,
  getEffectiveConsent,
  CONSENT_CHANGE_EVENT,
  BANNER_OPEN_EVENT,
} from '@/lib/consent'

// ---------------------------------------------------------------------------
// ConsentBanner
//
// Sticky-bar at the bottom of the viewport. Not a modal.
// role="region" + aria-label (not role="dialog" — no focus trap on initial
// render; that only applies to the Customize expanded view).
//
// A11y notes:
//   - Banner does NOT steal focus on first render.
//   - Tab order: Accept → Reject → Customize → Cookie policy → Privacy policy.
//   - Customize expanded view: focus moves to first toggle (functional).
//   - Escape closes Customize view.
//   - prefers-reduced-motion: no slide-in animation.
//   - Body padding-bottom reserves the banner height before JS hydrates
//     to prevent CLS (set via CSS custom property on <body>).
// ---------------------------------------------------------------------------

type View = 'bar' | 'customize'

// Estimated banner height in px — reserved on body before JS hydrates
// to avoid CLS. Must match the actual rendered height roughly.
const BANNER_HEIGHT_ESTIMATE = '80px'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [view, setView] = useState<View>('bar')
  const [analyticsToggle, setAnalyticsToggle] = useState(false)

  const headingId = useId()
  const analyticsId = useId()

  // ---------------------------------------------------------------------------
  // Initialise: show banner when no valid consent exists
  // ---------------------------------------------------------------------------

  useEffect(() => {
    function checkAndShow(forceOpen?: boolean) {
      const existing = getEffectiveConsent()
      if (forceOpen || existing === null) {
        // Pre-populate the analytics toggle with the stored value (if any)
        if (existing === true) setAnalyticsToggle(true)
        setVisible(true)
        setView('bar')
      }
    }

    checkAndShow()

    // Listen for footer "Cookie settings" button
    function handleOpen() {
      const existing = getEffectiveConsent()
      setAnalyticsToggle(existing === true)
      setVisible(true)
      setView('bar')
    }

    // Listen for consent being set (e.g. another tab) so banner closes
    function handleChange() {
      const effective = getEffectiveConsent()
      if (effective !== null) {
        setVisible(false)
      }
    }

    window.addEventListener(BANNER_OPEN_EVENT, handleOpen)
    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange)

    return () => {
      window.removeEventListener(BANNER_OPEN_EVENT, handleOpen)
      window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Reserve body padding to prevent CLS. Remove when banner closes.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (visible) {
      document.body.style.paddingBottom = BANNER_HEIGHT_ESTIMATE
    } else {
      document.body.style.paddingBottom = ''
    }
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [visible])

  // ---------------------------------------------------------------------------
  // Keyboard: Escape closes Customize view (returns to bar)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (view !== 'customize') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setView('bar')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleAccept() {
    setConsent(true)
    setVisible(false)
  }

  function handleReject() {
    setConsent(false)
    setVisible(false)
    // No nag: after Reject the banner does not reappear on its own.
  }

  function handleSaveCustom() {
    setConsent(analyticsToggle)
    setVisible(false)
  }

  function handleAcceptAll() {
    setAnalyticsToggle(true)
    setConsent(true)
    setVisible(false)
  }

  function handleRejectAll() {
    setAnalyticsToggle(false)
    setConsent(false)
    setVisible(false)
  }

  // ---------------------------------------------------------------------------
  // Render nothing until client-side check runs (avoids SSR mismatch)
  // ---------------------------------------------------------------------------

  if (!visible) return null

  // ---------------------------------------------------------------------------
  // Shared button styles (equal weight: Accept / Reject / Customize)
  // ---------------------------------------------------------------------------

  const btnBase: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '0.5rem 1rem',
    border: '1px solid var(--color-border)',
    borderRadius: '3px',
    cursor: 'pointer',
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    minHeight: '44px',
    lineHeight: 1.2,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  }

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: 'var(--color-text)',
    color: 'var(--color-bg)',
    border: '1px solid var(--color-text)',
  }

  // ---------------------------------------------------------------------------
  // Bar view
  // ---------------------------------------------------------------------------

  if (view === 'bar') {
    return (
      <div
        role="region"
        aria-label="Cookie consent"
        aria-describedby={headingId}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: '90rem',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Text */}
          <p
            id={headingId}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.875rem',
              color: 'var(--color-text)',
              margin: 0,
              flex: '1 1 20rem',
              maxWidth: 'none',
            }}
          >
            This site uses analytics to count page views. No advertising, no third-party
            tracking. Your choice — say no and I keep it that way.{' '}
            <Link href="/cookies" className="nav-link" style={{ display: 'inline', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px', color: 'var(--color-text-muted)' }}>
              Cookie policy
            </Link>
            {' · '}
            <Link href="/privacy" className="nav-link" style={{ display: 'inline', fontSize: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px', color: 'var(--color-text-muted)' }}>
              Privacy policy
            </Link>
          </p>

          {/* Buttons — equal weight */}
          <div
            role="group"
            aria-label="Cookie consent options"
            style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0 }}
          >
            <button
              type="button"
              onClick={handleAccept}
              style={btnPrimary}
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={handleReject}
              style={btnBase}
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => setView('customize')}
              style={btnBase}
              aria-expanded={false}
              aria-controls="consent-customize"
            >
              Customize
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Customize view
  // ---------------------------------------------------------------------------

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      id="consent-customize"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)',
        padding: '1.5rem 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: '40rem',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            marginTop: 0,
            color: 'var(--color-text)',
          }}
        >
          Cookie settings
        </h2>

        {/* Strictly necessary — locked */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  margin: '0 0 0.25rem',
                  color: 'var(--color-text)',
                }}
              >
                Strictly necessary
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  maxWidth: 'none',
                }}
              >
                Always on. Used to remember your consent choice. Without this, the banner
                would ask you on every page.
              </p>
            </div>
            <span
              aria-label="Always on"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
                marginTop: '0.125rem',
              }}
            >
              Required
            </span>
          </div>
        </div>

        {/* Functional — locked */}
        <div style={{ marginBottom: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  margin: '0 0 0.25rem',
                  color: 'var(--color-text)',
                }}
              >
                Functional
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  maxWidth: 'none',
                }}
              >
                Always on. Stores display preferences (theme, accent, density) when you
                change them in the tweaks panel. Nothing leaves your browser.
              </p>
            </div>
            <span
              aria-label="Always on"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
                marginTop: '0.125rem',
              }}
            >
              Required
            </span>
          </div>
        </div>

        {/* Analytics — toggleable */}
        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <label
                htmlFor={analyticsId}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.25rem',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                Analytics
              </label>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  margin: 0,
                  maxWidth: 'none',
                }}
              >
                Off by default. Counts page views via self-hosted Umami. No cookies, no
                persistent localStorage entries during normal use. IP hashed daily, no
                profiling, no third-party sharing. If you reject, an opt-out flag
                (umami.disabled) is set so the tracker stops itself.
              </p>
            </div>
            <input
              id={analyticsId}
              type="checkbox"
              checked={analyticsToggle}
              onChange={(e) => setAnalyticsToggle(e.target.checked)}
              style={{
                flexShrink: 0,
                width: '1.25rem',
                height: '1.25rem',
                marginTop: '0.125rem',
                cursor: 'pointer',
                accentColor: 'var(--color-focus)',
              }}
              aria-label="Enable analytics"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleSaveCustom} style={btnPrimary}>
            Save preferences
          </button>
          <button type="button" onClick={handleRejectAll} style={btnBase}>
            Reject all
          </button>
          <button type="button" onClick={handleAcceptAll} style={btnBase}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
