import type { Metadata } from 'next'
import { getArticlesByFormat } from '@/lib/articles'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Deep Dives',
  description: 'Full technical analysis, tested against real hardware. 1500 words and up.',
  openGraph: {
    title: 'Deep Dives',
    description: 'Full technical analysis, tested against real hardware. 1500 words and up.',
    type: 'website',
  },
}

export default function DeepDiveIndexPage() {
  const articles = getArticlesByFormat('deep-dive')

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Deep Dives' }]} />
        <div className="page-header">
          <h1 className="page-header__title">Deep Dives</h1>
          <p className="page-header__description">
            Full technical analysis when the topic earns it. Tested against real hardware, with
            versions named.
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-label="Deep Dives articles">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No Deep Dives published yet.</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
