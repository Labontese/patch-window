import type { ArticleMeta } from '@/lib/types'
import FormatTag from '@/components/FormatTag'

interface Props {
  article: ArticleMeta
}

export default function FeaturedPatch({ article }: Props) {
  const href = `/articles/${article.format}/${article.slug}`

  return (
    <article className="v2-patch v2-patch--featured" aria-labelledby="featured-patch-title">
      <p className="v2-patch__label">Latest patch</p>

      <FormatTag format={article.format} />

      <h2 id="featured-patch-title" className="v2-patch__title">
        <a href={href}>{article.title}</a>
      </h2>

      <p className="v2-patch__excerpt">{article.excerpt}</p>

      <div className="v2-patch__meta">
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString('en-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
        {article.readingTime && (
          <span>{article.readingTime} min read</span>
        )}
      </div>

      {/* Decorative diff block — aria-hidden so screen readers skip it */}
      <div className="v2-patch__diffbox" aria-hidden="true">
        <div className="v2-patch__diffbox-del">{'--- /dev/null'}</div>
        <div className="v2-patch__diffbox-add">
          {`+++ b/${article.format}/${article.slug}.mdx`}
        </div>
        <div className="v2-patch__diffbox-add">
          {'@@ -0,0 +1 @@ ' + article.title}
        </div>
      </div>
    </article>
  )
}
