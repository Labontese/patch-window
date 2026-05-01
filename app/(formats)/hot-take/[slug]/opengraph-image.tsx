/**
 * Per-artikel OG-bild — Hot Take.
 *
 * Anvander den delade terminal-templaten (lib/og-terminal.tsx).
 * `vim` ger formatet en skarpare ton an `cat` (forfattaren skriver, inte laser).
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { getArticleByFormatAndSlug } from '@/lib/articles'
import { renderTerminalOg, truncateSlug, OG_SIZE } from '@/lib/og-terminal'

// force-dynamic: hindrar Next.js fran att statiskt pre-rendera denna route.
export const dynamic = 'force-dynamic'

export const size = OG_SIZE
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const article = getArticleByFormatAndSlug('hot-take', slug)
  const title = article?.title ?? 'Patch Window'

  return renderTerminalOg({
    formatLabel: 'HOT-TAKE',
    command: `vim ${truncateSlug(slug)}.hot-take`,
    title,
  })
}
