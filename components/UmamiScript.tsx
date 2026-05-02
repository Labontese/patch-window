'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'
import { getEffectiveConsent, CONSENT_CHANGE_EVENT } from '@/lib/consent'

// ---------------------------------------------------------------------------
// UmamiScript
//
// Renders the Umami analytics script only when the user has given consent.
// This is the DPA-critical piece: the script must NOT appear in the DOM until
// analytics === true. Checking consent at render time is not enough because
// the layout is a Server Component — this Client Component re-renders on the
// CONSENT_CHANGE_EVENT custom event so the script is added/removed reactively.
//
// When consent is withdrawn: we do not hot-remove the script tag (Next.js
// Script with strategy="afterInteractive" does not support dynamic removal).
// Instead, we set localStorage.umami.disabled = 1 (Umami's own opt-out flag)
// which stops all future tracking. The cleanest path for withdrawal is a page
// reload, but the disabled flag alone is sufficient for compliance because
// no new data is sent after the flag is set.
// ---------------------------------------------------------------------------

export default function UmamiScript() {
  // Lazy initializer — avoids setState-in-effect-body lint error.
  // On the server getEffectiveConsent() returns null (window is undefined),
  // so analyticsEnabled starts false during SSR and hydration.
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(
    () => getEffectiveConsent() === true,
  )

  // Keep in sync with consent changes. setState only inside event callback,
  // not directly in the effect body.
  useEffect(() => {
    function handleChange(e: Event) {
      const detail = (e as CustomEvent<{ analytics: boolean }>).detail
      if (detail && typeof detail.analytics === 'boolean') {
        setAnalyticsEnabled(detail.analytics)
        // Manage Umami's own opt-out flag so no data is sent after withdrawal
        try {
          if (!detail.analytics) {
            localStorage.setItem('umami.disabled', '1')
          } else {
            localStorage.removeItem('umami.disabled')
          }
        } catch {
          // localStorage may be blocked in some private browsing modes
        }
      }
    }

    window.addEventListener(CONSENT_CHANGE_EVENT, handleChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleChange)
  }, [])

  if (!analyticsEnabled) return null

  return (
    <Script
      strategy="afterInteractive"
      src="https://analytics.holmdigital.se/script.js"
      data-website-id="2e94eb8f-6fe9-47d6-b1af-a8485f65d4ba"
    />
  )
}
