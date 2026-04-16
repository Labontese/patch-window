import type { Metadata } from 'next'
import { getArticlesByFormat } from '@/lib/articles'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Briefs',
  description: 'News with the context that makes it useful for people running real systems.',
  openGraph: {
    title: 'Briefs',
    description: 'News with the context that makes it useful for people running real systems.',
    type: 'website',
  },
}

export default function BriefIndexPage() {
  const articles = getArticlesByFormat('brief')

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Briefs' }]} />
        <div className="page-header">
          <h1 className="page-header__title">Briefs</h1>
          <p className="page-header__description">
            News with the context that makes it useful, plus what it means for people running the
            affected systems.
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-label="Briefs articles">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No Briefs published yet.</p>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
