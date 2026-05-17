import { ImageResponse } from 'next/og'
import { getArticleByFormatAndSlug } from '@/lib/articles'
import { renderTerminalOg, truncateSlug, OG_SIZE } from '@/lib/og-terminal'

export const dynamic = 'force-dynamic'

export const size = OG_SIZE
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params
  const article = getArticleByFormatAndSlug('guides', slug)
  const title = article?.title ?? 'Patch Window'

  if (article?.image) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    return new ImageResponse(
      (
        <img
          src={`${baseUrl}${article.image}`}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ),
      { ...OG_SIZE }
    )
  }

  return renderTerminalOg({
    formatLabel: 'GUIDE',
    command: `cat ${truncateSlug(slug)}.guide`,
    title,
  })
}
