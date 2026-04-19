import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PATHWAYS } from '@/lib/types'
import { getArticlesByPathway } from '@/lib/articles'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import ArticleCard from '@/components/ArticleCard'
import Breadcrumbs from '@/components/Breadcrumbs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PATHWAYS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'content', 'pathways', `${slug}.mdx`)

  let description = `Articles in the ${slug} pathway.`
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    if (data.description) description = data.description as string
  }

  return {
    title: slug,
    description,
    openGraph: { title: slug, description, type: 'website' },
  }
}

export default async function PathwayPage({ params }: Props) {
  const { slug } = await params

  if (!PATHWAYS.includes(slug as (typeof PATHWAYS)[number])) {
    notFound()
  }

  const filePath = path.join(process.cwd(), 'content', 'pathways', `${slug}.mdx`)
  let Content: React.ComponentType | null = null
  let title = slug

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)
    if (data.title) title = data.title as string
    const mod = await import(`@/content/pathways/${slug}.mdx`)
    Content = mod.default
  }

  const articles = getArticlesByPathway(slug)

  return (
    <>
      <InnerHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: `Pathway: ${title}` },
          ]}
        />
        <div className="page-header">
          <h1 className="page-header__title">{title}</h1>
        </div>
        {Content && (
          <div className="content-col" style={{ marginBottom: '2.5rem' }}>
            <Content />
          </div>
        )}
        {articles.length > 0 ? (
          <section aria-labelledby="pathway-articles-heading">
            <h2 id="pathway-articles-heading" className="visually-hidden">
              Articles in {title}
            </h2>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No articles in this pathway yet.</p>
        )}
      </main>
      <InnerFooter />
    </>
  )
}
