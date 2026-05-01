/**
 * Per-pathway OG-bild.
 *
 * PATHWAY-variant: blå accent, visar pathway-displayName som titel.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { ImageResponse } from 'next/og'
import { getPathwayDisplayName } from '@/lib/types'

// force-dynamic: hindrar statisk pre-rendering. Konsekvent med format-routes.
export const dynamic = 'force-dynamic'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const title = getPathwayDisplayName(slug)

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
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#ffffff',
              background: '#1d4ed8',
              padding: '6px 14px',
              display: 'inline-flex',
              alignSelf: 'flex-start',
            }}
          >
            PATHWAY
          </div>

          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 28,
              fontWeight: 700,
              color: '#a0a0a0',
            }}
          >
            Patch Window
          </div>
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 36,
              fontWeight: 700,
              color: '#d4a017',
              letterSpacing: '-0.02em',
            }}
          >
            $_
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
