import type { Metadata } from 'next'
import { getArticlesByTag, getAllTags } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `#${slug}`,
    description: `Articles tagged with ${slug} on Patch Window.`,
    openGraph: {
      title: `#${slug}`,
      description: `Articles tagged with ${slug} on Patch Window.`,
      type: 'website',
    },
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const articles = getArticlesByTag(slug)

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[{ label: 'Home', href: '/' }, { label: `#${slug}` }]}
        />
        <div className="page-header">
          <h1 className="page-header__title">#{slug}</h1>
          <p className="page-header__description">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
        {articles.length > 0 ? (
          <section aria-labelledby="tag-articles-heading">
            <h2 id="tag-articles-heading" className="visually-hidden">
              Articles tagged {slug}
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
