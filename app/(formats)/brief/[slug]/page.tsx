import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleByFormatAndSlug, getArticlesByFormat } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import ArticleHeader from '@/components/ArticleHeader'
import Breadcrumbs from '@/components/Breadcrumbs'
import { safeJsonLd } from '@/lib/jsonld'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getArticlesByFormat('brief').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('brief', slug)
  if (!meta) return {}

  const url = `https://patchwindow.serverdigital.net/brief/${slug}`

  return {
    title: meta.title,
    alternates: { canonical: url },
    description: meta.excerpt,
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: 'article',
      url,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      tags: meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@DanneGsson',
      title: meta.title,
      description: meta.excerpt,
    },
  }
}

export default async function BriefPage({ params }: Props) {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('brief', slug)
  if (!meta) notFound()

  const { default: Content } = await import(`@/content/articles/brief/${slug}.mdx`)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: meta.title,
    description: meta.excerpt,
    image: 'https://patchwindow.serverdigital.net/opengraph-image',
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt ?? meta.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Daniel Gustafsson',
      url: 'https://patchwindow.serverdigital.net/about/daniel',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Patch Window',
      logo: { '@type': 'ImageObject', url: 'https://patchwindow.serverdigital.net/logo/glyph-window.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://patchwindow.serverdigital.net/brief/${slug}`,
    },
    keywords: meta.tags,
    articleSection: 'Brief',
  }

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Briefs', href: '/brief' },
            { label: meta.title },
          ]}
        />
        <div className="article-layout">
          <article className="content-col">
            <ArticleHeader meta={meta} />
            <div className="article-body">
              <Content />
            </div>
          </article>
        </div>
      </main>
      <InnerFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
    </>
  )
}
