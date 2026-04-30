import Link from 'next/link'
import type { ArticleMeta } from '@/lib/types'
import { getPathwayDisplayName } from '@/lib/types'
import FormatTag from './FormatTag'

interface Props {
  article: ArticleMeta
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ArticleCard({ article }: Props) {
  const href = `/${article.format}/${article.slug}`
  const cardClass = `article-card${article.format === 'hot-take' ? ' article-card--hot-take' : ''}`

  return (
    <article className={cardClass}>
      <FormatTag format={article.format} />
      <h3 className="article-card__title">
        <Link
          href={href}
          data-umami-event="article-click"
          data-umami-event-slug={article.slug}
          data-umami-event-format={article.format}
        >
          {article.title}
        </Link>
      </h3>
      <div className="article-meta" style={{ marginBottom: '0.5rem' }}>
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {article.format === 'deep-dive' && article.readingTime && (
          <span className="reading-time">{article.readingTime} min read</span>
        )}
        {article.pathway && (
          <Link
            href={`/pathway/${article.pathway}`}
            className="pathway-badge"
            data-umami-event="pathway-click"
            data-umami-event-pathway={article.pathway}
          >
            {getPathwayDisplayName(article.pathway)}
          </Link>
        )}
      </div>
      {article.excerpt && (
        <p className="article-card__excerpt">{article.excerpt}</p>
      )}
    </article>
  )
}
