import type { Metadata } from 'next'
import { getArticlesByFormat } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

const BASE = 'https://patchwindow.serverdigital.net'

export const metadata: Metadata = {
  title: 'Guides',
  description: 'Step-by-step guides for sysadmins and DevOps engineers running production infrastructure.',
  openGraph: {
    title: 'Guides',
    description: 'Step-by-step guides for sysadmins and DevOps engineers running production infrastructure.',
    type: 'website',
    url: `${BASE}/guides`,
  },
  twitter: { card: 'summary_large_image', creator: '@DanneGsson' },
}

export default function GuidesIndexPage() {
  const articles = getArticlesByFormat('guides')

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Guides' }]} />
        <div className="page-header">
          <h1 className="page-header__title">Guides</h1>
          <p className="page-header__description">
            Step-by-step guides for sysadmins and DevOps engineers running production infrastructure.
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-label="Guide articles">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No Guides published yet.</p>
        )}
      </main>
      <Footer />
    </>
  )
}
