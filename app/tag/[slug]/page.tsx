import type { Metadata } from 'next'
import { getArticlesByTag, getAllTags } from '@/lib/articles'
import { slugToTitle } from '@/lib/types'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import { safeJsonLd } from '@/lib/jsonld'

const BASE = 'https://patchwindow.serverdigital.net'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const displayName = slugToTitle(slug)
  const url = `${BASE}/tag/${slug}`
  return {
    title: `${displayName} articles`,
    description: `Articles tagged ${displayName} on Patch Window.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${displayName} articles`,
      description: `Articles tagged ${displayName} on Patch Window.`,
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@DanneGsson',
      title: `${displayName} articles`,
      description: `Articles tagged ${displayName} on Patch Window.`,
    },
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const articles = getArticlesByTag(slug)
  const displayName = slugToTitle(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${displayName} articles`,
    url: `${BASE}/tag/${slug}`,
  }

  return (
    <>
      <InnerHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: `Tag: ${displayName}` }]}
        />
        <div className="page-header">
          <h1 className="page-header__title">{displayName}</h1>
          <p className="page-header__description">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'} tagged{' '}
            <code>#{slug}</code>
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-labelledby="tag-articles-heading">
            <h2 id="tag-articles-heading" className="visually-hidden">
              Articles tagged {displayName}
            </h2>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No articles with this tag yet.</p>
        )}
      </main>
      <InnerFooter />
    </>
  )
}
