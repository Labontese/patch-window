/**
 * app/opengraph-image.tsx — default OG-bild för startsidan.
 *
 * 1200x630 PNG. Nattfönster-bakgrund, Playfair Display-rubrik,
 * amber-accent, $_ glyph-signatur i nedre höger hörn.
 *
 * Artikelsidor kan lägga sin egen opengraph-image.tsx i route-mappen
 * för att få per-artikel-rubrik. Den här filen är fallback för startsidan.
 *
 * ImageResponse stödjer flexbox + en delmängd av CSS.
 * display: grid stöds inte — allt är flex.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { ImageResponse } from 'next/og'

// Edge runtime: Next.js genererar bilden vid request-tid.
// Losning pa Windows-buggen dar @vercel/og missar systemfont-sokvagen
// under statisk pre-rendering.
export const runtime = 'edge'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a1628',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Top section: publication name + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Publication wordmark */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 56,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            Patch Window
          </div>

          {/* Amber rule line */}
          <div
            style={{
              width: '64px',
              height: '3px',
              background: '#d4a017',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 22,
              color: '#a0a0a0',
              letterSpacing: '0.04em',
              marginTop: '8px',
            }}
          >
            Linux · DevOps · AIOps · Production
          </div>
        </div>

        {/* Bottom section: domain + glyph signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Domain */}
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 18,
              color: '#595959',
              letterSpacing: '0.06em',
            }}
          >
            patchwindow.serverdigital.net
          </div>

          {/* $_ glyph signature */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '6px',
            }}
          >
            <div
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 42,
                fontWeight: 700,
                color: '#d4a017',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              $_
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
