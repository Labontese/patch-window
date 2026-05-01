/**
 * Per-pathway OG-bild.
 *
 * Anvander den delade terminal-templaten (lib/og-terminal.tsx).
 * `ls -la` signalerar att en pathway ar en samling av artiklar.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { getPathwayDisplayName } from '@/lib/types'
import { renderTerminalOg, truncateSlug, OG_SIZE } from '@/lib/og-terminal'

// force-dynamic: hindrar statisk pre-rendering. Konsekvent med format-routes.
export const dynamic = 'force-dynamic'

export const size = OG_SIZE
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const title = getPathwayDisplayName(slug)

  return renderTerminalOg({
    formatLabel: 'PATHWAY',
    command: `ls -la pathway/${truncateSlug(slug)}/`,
    title,
  })
}
