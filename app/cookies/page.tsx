import type { Metadata } from 'next'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Cookie Policy | Patch Window',
  description:
    'What Patch Window stores in your browser, why, and how to change it.',
  alternates: { canonical: 'https://patchwindow.serverdigital.net/cookies' },
  robots: { index: true, follow: true },
}

export default function CookiesPage() {
  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cookie Policy' }]} />
        <div className="content-col">
          <h1>Cookie Policy</h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Last updated: 2 May 2026
          </p>

          <h2>What this site stores in your browser</h2>
          <p>
            This site does not use traditional cookies. But under EU ePrivacy law, the rules
            apply to anything stored or read on your device &mdash; not just cookies. Here is
            the full list.
          </p>

          <h3>Strictly necessary (no consent required)</h3>
          <p>These are required to make the site work. They cannot be disabled.</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><code>pw-consent</code></td>
                  <td style={tdStyle}>localStorage</td>
                  <td style={tdStyle}>Stores your answer to the consent banner so it does not ask again</td>
                  <td style={tdStyle}>12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Functional (no consent required &mdash; user-requested)</h3>
          <p>
            These store your preferences. They exist because you actively asked for them, not
            because the site wants to track you.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><code>pw-prefs</code></td>
                  <td style={tdStyle}>localStorage</td>
                  <td style={tdStyle}>Theme (dark/light), accent colour, density, serif toggle, easter egg state</td>
                  <td style={tdStyle}>Until you clear browser storage</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Analytics (consent required &mdash; off by default)</h3>
          <p>
            Loaded only if you accept analytics in the consent banner. The Umami tracker
            does not write a session cookie or persistent localStorage entry on your device.
            Consent is still required because the tracker reads your User-Agent string and
            screen attributes to count distinct visits, which counts as access to information
            stored on your device under EDPB Guidelines 2/2023 on the technical scope of
            ePrivacy Article 5(3).
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Set by</th>
                  <th style={thStyle}>Purpose</th>
                  <th style={thStyle}>Lifetime</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><code>umami.disabled</code></td>
                  <td style={tdStyle}>localStorage</td>
                  <td style={tdStyle}>Umami tracker</td>
                  <td style={tdStyle}>Opt-out flag, only set if you reject or withdraw consent</td>
                  <td style={tdStyle}>Until you clear browser storage</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Marketing</h3>
          <p>None. I run no advertising, no retargeting, no audience networks.</p>

          <h2>How to manage your choice</h2>
          <ul>
            <li>
              Open the &ldquo;Cookie settings&rdquo; link in the footer at any time to change
              your decision.
            </li>
            <li>Clearing your browser&rsquo;s site data resets all stored values.</li>
            <li>
              &ldquo;Reject&rdquo; disables analytics on this site permanently for this browser.
              The functional and consent-state entries remain because they are required to honour
              your reject choice.
            </li>
          </ul>

          <h2>Server-side data (not stored in your browser)</h2>
          <p>
            Separately from browser storage, my server logs your IP address and user-agent for
            30 days as part of standard operations (security, abuse prevention). This is covered
            under &ldquo;Legitimate interest&rdquo; in the{' '}
            <a href="/privacy">Privacy Policy</a> and is not affected by your consent choice.
          </p>
          <p>
            If you accept analytics, Umami stores aggregate visit data on my server for 25
            months. If you reject, nothing is stored on the server beyond the standard request
            log.
          </p>

          <h2>Why I bothered with this page</h2>
          <p>
            The EU ePrivacy Directive (Article 5(3)) and the EDPB guidelines from October 2024
            say that any storage on a user&rsquo;s device requires consent unless it is strictly
            necessary or user-requested. That includes localStorage, not just cookies. Most sites
            have a banner that lies about what it does. This page says what is actually there.
          </p>
        </div>
      </main>
      <InnerFooter />
    </>
  )
}

// ---------------------------------------------------------------------------
// Table cell styles — defined here to avoid repetition in JSX
// ---------------------------------------------------------------------------

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid var(--color-border)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  color: 'var(--color-text)',
}

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderBottom: '1px solid var(--color-border-subtle)',
  verticalAlign: 'top',
  color: 'var(--color-text)',
}
