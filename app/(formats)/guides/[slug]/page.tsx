import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleByFormatAndSlug, getArticlesByFormat } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import Footer from '@/components/Footer'
import ArticleHeader from '@/components/ArticleHeader'
import AuthorBio from '@/components/AuthorBio'
import Breadcrumbs from '@/components/Breadcrumbs'
import { safeJsonLd } from '@/lib/jsonld'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getArticlesByFormat('guides').map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('guides', slug)
  if (!meta) return {}

  const url = `https://patchwindow.serverdigital.net/guides/${slug}`

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

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const meta = getArticleByFormatAndSlug('guides', slug)
  if (!meta) notFound()

  const { default: Content } = await import(`@/content/articles/guides/${slug}.mdx`)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: meta.title,
    description: meta.excerpt,
    image: 'https://patchwindow.serverdigital.net/opengraph-image.png',
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
      logo: { '@type': 'ImageObject', url: 'https://patchwindow.serverdigital.net/logo/logo.png', width: 600, height: 60 },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://patchwindow.serverdigital.net/guides/${slug}`,
    },
    keywords: meta.tags,
    articleSection: 'Guide',
  }

  const faqJsonLd = slug === 'wazuh-cluster-hardening-2026' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Does upgrading to Wazuh 5.0 replace these hardening steps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Wazuh 5.0 was architected before CVE-2026-25769 and CVE-2026-30893 were discovered. DAPI — the code path where CVE-2026-25769 lived — is kept in 5.0. The hardening steps in this guide apply to 4.14.x and will remain relevant after migrating to 5.0.',
        },
      },
      {
        '@type': 'Question',
        name: 'What port does the Wazuh cluster protocol use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TCP/1516. This is the cluster communication port between master and worker nodes, protected by a shared Fernet key. By default it binds to 0.0.0.0 — restrict it to specific internal IPs as the first hardening step.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Wazuh Fernet key and how do I rotate it?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "The Fernet key is a shared secret stored in the cluster block of /var/ossec/etc/ossec.conf on all nodes. It authenticates cluster peers. To rotate: generate a new key with python3 -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())', update the master first, then all workers, and restart. Requires a brief maintenance window.",
        },
      },
      {
        '@type': 'Question',
        name: 'Which Wazuh versions are affected by CVE-2026-25769?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Wazuh 4.0.0 through 4.14.2 are affected. The fix shipped in 4.14.3 (February 2026). The vulnerability is insecure deserialization in DAPI that allows an authenticated worker node to achieve RCE on the master as root. A public proof-of-concept exists.',
        },
      },
    ],
  } : null

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
            { label: meta.title },
          ]}
        />
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
              <Link
                href={`/pathway/${meta.pathway}`}
                className="pathway-badge"
                data-umami-event="pathway-click"
                data-umami-event-pathway={meta.pathway}
              >
                {meta.pathway}
              </Link>
            </div>
            {meta.tags.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                  Tags
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {meta.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag}`}
                      className="tag-pill"
                      data-umami-event="tag-click"
                      data-umami-event-tag={tag}
                    >
                      {tag}
                    </Link>
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
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
      )}
    </>
  )
}
