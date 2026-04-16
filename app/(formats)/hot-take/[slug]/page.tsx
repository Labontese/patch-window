import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleByFormatAndSlug, getArticlesByFormat } from '@/lib/articles'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleHeader from '@/components/ArticleHeader'
import AuthorBio from '@/components/AuthorBio'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getArticlesByFormat('hot-take').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('hot-take', slug)
  if (!meta) return {}

  const url = `https://patchwindow.serverdigital.net/hot-take/${slug}`

  return {
    title: meta.title,
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
      title: meta.title,
      description: meta.excerpt,
    },
  }
}

export default async function HotTakePage({ params }: Props) {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('hot-take', slug)
  if (!meta) notFound()

  const { default: Content } = await import(`@/content/articles/hot-take/${slug}.mdx`)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
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
      logo: { '@type': 'ImageObject', url: 'https://patchwindow.serverdigital.net/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://patchwindow.serverdigital.net/hot-take/${slug}`,
    },
    keywords: meta.tags,
    articleSection: 'Hot Take',
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Hot Takes', href: '/hot-take' },
            { label: meta.title },
          ]}
        />
        <div className="article-layout">
          <article className="article--hot-take content-col">
            <ArticleHeader meta={meta} />
            <div className="article-body">
              <Content />
            </div>
            <AuthorBio />
          </article>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  )
}
