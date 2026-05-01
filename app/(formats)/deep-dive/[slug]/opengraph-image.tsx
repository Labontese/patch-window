/**
 * Per-artikel OG-bild — Deep Dive.
 *
 * Anvander den delade terminal-templaten (lib/og-terminal.tsx).
 * `less` istallet for `cat` for att signalera lang text.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { getArticleByFormatAndSlug } from '@/lib/articles'
import { renderTerminalOg, truncateSlug, OG_SIZE } from '@/lib/og-terminal'

// force-dynamic: hindrar statisk pre-rendering. fs-anrop ej edge-kompatibelt.
export const dynamic = 'force-dynamic'

export const size = OG_SIZE
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const article = getArticleByFormatAndSlug('deep-dive', slug)
  const title = article?.title ?? 'Patch Window'

  return renderTerminalOg({
    formatLabel: 'DEEP-DIVE',
    command: `less ${truncateSlug(slug)}.deep-dive`,
    title,
  })
}
