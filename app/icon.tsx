/**
 * app/icon.tsx — genererar PNG-favicon via Next.js ImageResponse.
 *
 * Next.js serverar detta som /icon.png och lägger automatiskt till
 * <link rel="icon"> i <head>. app/icon.svg hanterar SVG-favicon
 * (moderna browsers). Den här filen är fallback PNG 32x32.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { ImageResponse } from 'next/og'

// Edge runtime: Next.js genererar ikonen vid request-tid, inte statiskt.
// Losning pa Windows-buggen dar @vercel/og missar systemfont-sokvagen
// under statisk pre-rendering (fileURLToPath-fel i node-runtime).
// Pa Hetzner (Linux) fungerar bada runtimes.
export const runtime = 'edge'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 4,
        }}
      >
        {/* $_ glyph i amber mot navy — 32x32 */}
        <svg
          viewBox="0 0 32 32"
          width="28"
          height="28"
          style={{ display: 'block' }}
        >
          {/* $ — vertical stroke */}
          <rect fill="#d4a017" x="6" y="1" width="2" height="14" rx="0.5" />
          {/* $ — top bar */}
          <rect fill="#d4a017" x="4" y="2.5" width="6" height="1.5" rx="0.5" />
          <rect fill="#d4a017" x="4" y="2.5" width="1.5" height="3" rx="0.5" />
          {/* $ — mid bar */}
          <rect fill="#d4a017" x="4" y="7.5" width="6" height="1.5" rx="0.5" />
          {/* $ — bottom bar */}
          <rect fill="#d4a017" x="4" y="12" width="6" height="1.5" rx="0.5" />
          <rect fill="#d4a017" x="8.5" y="10.5" width="1.5" height="3" rx="0.5" />
          {/* cursor block */}
          <rect fill="#d4a017" x="14" y="4" width="7" height="8" rx="0.5" />
          {/* underscore */}
          <rect fill="#d4a017" x="14" y="14" width="7" height="1.5" rx="0.5" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
