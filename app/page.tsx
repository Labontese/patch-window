import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import './patch-log.css'
import type { Format } from '@/lib/types'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Patch Window',
  description:
    'Linux, networking, containers, DevOps, and AI in production environments. Written by a practitioner.',
  openGraph: {
    type: 'website',
    title: 'Patch Window',
    description:
      'Linux, networking, containers, DevOps, and AI in production environments. Written by a practitioner.',
  },
}

const FORMAT_SECTIONS: Array<{ format: Format; heading: string; limit: number }> = [
  { format: 'hot-take', heading: 'Hot Takes', limit: 5 },
  { format: 'deep-dive', heading: 'Deep Dives', limit: 3 },
  { format: 'brief', heading: 'Briefs', limit: 5 },
]

export default function HomePage() {
  const allArticles = getAllArticles()

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        {/* Visually hidden h1 — SiteHeader carries the wordmark visually; screen
            readers and search engines need a semantic page heading. */}
        <h1 className="visually-hidden">Patch Window</h1>
        {FORMAT_SECTIONS.map(({ format, heading, limit }) => {
          const articles = allArticles.filter((a) => a.format === format).slice(0, limit)
          if (articles.length === 0) return null
          return (
            <section key={format} className="home-section" aria-labelledby={`section-${format}`}>
              <h2 id={`section-${format}`} className="home-section__heading">
                {heading}
              </h2>
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>
          )
        })}
        {allArticles.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)' }}>No articles published yet.</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
