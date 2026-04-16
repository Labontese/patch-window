/**
 * app/apple-icon.tsx — genererar apple-touch-icon 180x180 PNG.
 *
 * Next.js serverar detta som apple-icon.png och lägger automatiskt till
 * <link rel="apple-touch-icon"> i <head>.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { ImageResponse } from 'next/og'

// Edge runtime: samma motivering som app/icon.tsx.
export const runtime = 'edge'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1628',
          borderRadius: 32,
        }}
      >
        {/* $_ glyph skalad till 180x180 */}
        <svg
          viewBox="0 0 64 32"
          width="130"
          height="65"
          style={{ display: 'block' }}
        >
          {/* Dollar sign: vertical stroke */}
          <rect fill="#d4a017" x="11" y="2" width="3" height="28" rx="1" />
          {/* $ top bar */}
          <rect fill="#d4a017" x="7" y="5" width="11" height="3" rx="1" />
          <rect fill="#d4a017" x="7" y="5" width="3" height="6" rx="1" />
          {/* $ mid bar */}
          <rect fill="#d4a017" x="7" y="14.5" width="11" height="3" rx="1" />
          {/* $ bottom bar */}
          <rect fill="#d4a017" x="7" y="24" width="11" height="3" rx="1" />
          <rect fill="#d4a017" x="15" y="21" width="3" height="6" rx="1" />
          {/* Block cursor */}
          <rect fill="#d4a017" x="30" y="8" width="13" height="16" rx="1" />
          {/* Underscore */}
          <rect fill="#d4a017" x="30" y="27" width="13" height="3" rx="1" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
