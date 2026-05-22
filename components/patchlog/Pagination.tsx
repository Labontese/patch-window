import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label="Pagination" className="v2-pagination">
      {currentPage > 1 ? (
        <Link href={currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}`} className="v2-pagination__link">
          ← Prev
        </Link>
      ) : (
        <span className="v2-pagination__link v2-pagination__link--disabled" aria-hidden="true">
          ← Prev
        </span>
      )}

      <ol className="v2-pagination__pages" role="list">
        {pages.map((p) => (
          <li key={p}>
            {p === currentPage ? (
              <span
                className="v2-pagination__link v2-pagination__link--current"
                aria-current="page"
              >
                {p}
              </span>
            ) : (
              <Link href={p === 1 ? '/' : `/page/${p}`} className="v2-pagination__link">
                {p}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {currentPage < totalPages ? (
        <Link href={`/page/${currentPage + 1}`} className="v2-pagination__link">
          Next →
        </Link>
      ) : (
        <span className="v2-pagination__link v2-pagination__link--disabled" aria-hidden="true">
          Next →
        </span>
      )}
    </nav>
  )
}
