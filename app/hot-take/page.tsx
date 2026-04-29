import type { Metadata } from 'next'
import { getArticlesByFormat } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

const BASE = 'https://patchwindow.serverdigital.net'

export const metadata: Metadata = {
  title: 'Hot Takes',
  description: 'Fast, opinionated reactions to things that ship and deserve a response.',
  openGraph: {
    title: 'Hot Takes',
    description: 'Fast, opinionated reactions to things that ship and deserve a response.',
    type: 'website',
    url: `${BASE}/hot-take`,
  },
  twitter: { card: 'summary_large_image', creator: '@DanneGsson' },
}

export default function HotTakeIndexPage() {
  const articles = getArticlesByFormat('hot-take')

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Hot Takes' }]} />
        <div className="page-header">
          <h1 className="page-header__title">Hot Takes</h1>
          <p className="page-header__description">
            Fast and opinionated when something ships that deserves a reaction.
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-label="Hot Takes articles">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No Hot Takes published yet.</p>
        )}
      </main>
      <InnerFooter />
    </>
  )
}
