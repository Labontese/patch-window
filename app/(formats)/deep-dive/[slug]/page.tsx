import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleByFormatAndSlug, getArticlesByFormat } from '@/lib/articles'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ArticleHeader from '@/components/ArticleHeader'
import AuthorBio from '@/components/AuthorBio'
import Breadcrumbs from '@/components/Breadcrumbs'
import { safeJsonLd } from '@/lib/jsonld'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getArticlesByFormat('deep-dive').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('deep-dive', slug)
  if (!meta) return {}

  const url = `https://patchwindow.serverdigital.net/deep-dive/${slug}`

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

export default async function DeepDivePage({ params }: Props) {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('deep-dive', slug)
  if (!meta) notFound()

  const { default: Content } = await import(`@/content/articles/deep-dive/${slug}.mdx`)

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
      logo: { '@type': 'ImageObject', url: 'https://patchwindow.serverdigital.net/logo/glyph-window.svg' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://patchwindow.serverdigital.net/deep-dive/${slug}`,
    },
    keywords: meta.tags,
    articleSection: 'Deep Dive',
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Deep Dives', href: '/deep-dive' },
            { label: meta.title },
          ]}
        />
        {/* Article body before sidebar in DOM order (SC 1.3.2, 2.4.3) */}
        <div className="article-layout article-layout--with-sidebar">
          <article className="content-col">
            <ArticleHeader meta={meta} />
            <div className="article-body">
              <Content />
            </div>
            <AuthorBio />
          </article>
          <aside className="article-sidebar" aria-label="Article metadata">
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text)' }}>
                Pathway
              </p>
              <a
                href={`/pathway/${meta.pathway}`}
                className="pathway-badge"
                data-umami-event="pathway-click"
                data-umami-event-pathway={meta.pathway}
              >
                {meta.pathway}
              </a>
            </div>
            {meta.tags.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                  Tags
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {meta.tags.map((tag) => (
                    <a
                      key={tag}
                      href={`/tag/${tag}`}
                      className="tag-pill"
                      data-umami-event="tag-click"
                      data-umami-event-tag={tag}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {meta.readingTime && (
              <p className="reading-time">{meta.readingTime} min read</p>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
    </>
  )
}
