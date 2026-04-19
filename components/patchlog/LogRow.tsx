import type { ArticleMeta } from '@/lib/types'
import FormatTag from '@/components/FormatTag'

interface Props {
  article: ArticleMeta
  index: number
}

export default function LogRow({ article, index }: Props) {
  const href = `/articles/${article.format}/${article.slug}`
  const paddedIndex = String(index + 1).padStart(3, '0')

  return (
    <tr className="v2-log__row">
      <td className="v2-log__cell v2-log__cell--index" aria-hidden="true">
        {paddedIndex}
      </td>
      <td className="v2-log__cell v2-log__cell--format">
        <FormatTag format={article.format} />
      </td>
      <td className="v2-log__cell v2-log__cell--title">
        <a href={href} className="v2-log__link">
          {article.title}
        </a>
      </td>
      <td className="v2-log__cell v2-log__cell--date">
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString('en-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </td>
      <td className="v2-log__cell v2-log__cell--time">
        {article.readingTime ? `${article.readingTime}m` : '—'}
      </td>
    </tr>
  )
}
