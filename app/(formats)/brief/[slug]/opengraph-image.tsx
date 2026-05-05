/**
 * Per-artikel OG-bild — Brief.
 *
 * Anvander den delade terminal-templaten (lib/og-terminal.tsx) for att halla
 * visuell konsistens med deep-dive, hot-take, pathway och tag.
 *
 * Verifierat mot Context7 (Next.js 15, 2026-04-15).
 */

import { ImageResponse } from 'next/og'
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
  const article = getArticleByFormatAndSlug('brief', slug)
  const title = article?.title ?? 'Patch Window'

  if (article?.image) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    return new ImageResponse(
      (
        <img
          src={`${baseUrl}${article.image}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
      { ...OG_SIZE }
    )
  }

  return renderTerminalOg({
    formatLabel: 'BRIEF',
    command: `cat ${truncateSlug(slug)}.brief`,
    title,
  })
}
