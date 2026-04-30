import Link from 'next/link'
import type { ArticleMeta } from '@/lib/types'
import { getPathwayDisplayName, slugToTitle } from '@/lib/types'
import FormatTag from './FormatTag'

interface Props {
  meta: ArticleMeta
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ArticleHeader({ meta }: Props) {
  return (
    <header className="article-header">
      <FormatTag format={meta.format} />
      <h1 className="article-header__title">{meta.title}</h1>
      <div className="article-meta">
        <time dateTime={meta.publishedAt}>{formatDate(meta.publishedAt)}</time>
        {meta.updatedAt && meta.updatedAt !== meta.publishedAt && (
          <span>Updated <time dateTime={meta.updatedAt}>{formatDate(meta.updatedAt)}</time></span>
        )}
        {meta.format === 'deep-dive' && meta.readingTime && (
          <span className="reading-time" aria-label={`Estimated reading time: ${meta.readingTime} minutes`}>
            {meta.readingTime} min read
          </span>
        )}
        <Link href="/about/daniel" className="article-byline-link">
          Daniel Gustafsson
        </Link>
        {meta.pathway && (
          <Link href={`/pathway/${meta.pathway}`} className="pathway-badge">
            {getPathwayDisplayName(meta.pathway)}
          </Link>
        )}
      </div>
      {meta.tags && meta.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
          {meta.tags.map((tag) => (
            <Link key={tag} href={`/tag/${tag}`} className="tag-pill">
              {slugToTitle(tag)}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
