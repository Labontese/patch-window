/**
 * Per-tag OG-bild.
 *
 * Anvander den delade terminal-templaten (lib/og-terminal.tsx).
 * `grep -rn "<tag>" articles/` reflekterar att en tag ar ett tvarsnitt.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { slugToTitle } from '@/lib/types'
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
  const title = slugToTitle(slug)

  return renderTerminalOg({
    formatLabel: 'TAG',
    command: `grep -rn "${truncateSlug(slug)}" articles/`,
    title,
  })
}
