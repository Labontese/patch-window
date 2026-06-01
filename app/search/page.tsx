import type { Metadata } from 'next'
import Fuse from 'fuse.js'
import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import InnerHeader from '@/components/InnerHeader'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const allArticles = getAllArticles()

  let results = allArticles
  let heading = 'Search'

  if (query) {
    const fuse = new Fuse(allArticles, {
      threshold: 0.4,
      keys: [
        { name: 'title', weight: 3 },
        { name: 'excerpt', weight: 2 },
        { name: 'tags', weight: 1.5 },
        { name: 'pathway', weight: 1 },
      ],
    })
    results = fuse.search(query).map((r) => r.item)
    heading = `Results for "${query}"`
  } else {
    results = allArticles.slice(0, 10)
  }

  return (
    <>
      <InnerHeader />
      <main
        id="main-content"
        className="site-wrapper"
        style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}
      >
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
        />
        <div className="page-header">
          <h1 className="page-header__title">{heading}</h1>
        </div>

        <form action="/search" method="GET" style={{ marginBottom: '2rem' }}>
          <label htmlFor="search-input" className="visually-hidden">
            Search articles
          </label>
          <input
            id="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles…"
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.6rem 0.8rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              background: 'var(--color-bg-alt, var(--color-bg))',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
            }}
          />
          <button type="submit" className="visually-hidden">
            Search
          </button>
        </form>

        {query ? (
          results.length > 0 ? (
            <section aria-label={`Search results for ${query}`}>
              {results.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>
              No results for &ldquo;{query}&rdquo;
            </p>
          )
        ) : (
          <>
            <p
              style={{
                color: 'var(--color-text-muted)',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
              }}
            >
              Recent articles
            </p>
            <section aria-label="Recent articles">
              {results.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
