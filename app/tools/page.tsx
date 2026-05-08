import type { Metadata } from 'next'
import InnerHeader from '@/components/InnerHeader'
import InnerFooter from '@/components/InnerFooter'
import Breadcrumbs from '@/components/Breadcrumbs'

const BASE = 'https://patchwindow.serverdigital.net'

export const metadata: Metadata = {
  title: 'Open-source tools | Patch Window',
  description:
    'Open-source tools published by Patch Window — MCP servers, CLI utilities, and infrastructure helpers for sysadmins and platform engineers.',
  alternates: { canonical: `${BASE}/tools` },
  openGraph: {
    title: 'Open-source tools | Patch Window',
    description:
      'Open-source tools published by Patch Window — MCP servers, CLI utilities, and infrastructure helpers for sysadmins and platform engineers.',
    type: 'website',
    url: `${BASE}/tools`,
  },
  twitter: { card: 'summary_large_image', creator: '@DanneGsson' },
}

interface Tool {
  name: string
  description: string
  github: string
  npm?: string
  tag: string
}

const tools: Tool[] = [
  {
    name: 'seo-mcp',
    description:
      'MCP server with 10 SEO tools for Google Search Console and Bing Webmaster Tools. Striking distance finder, traffic drop diagnosis, keyword research, URL inspection, and more — query directly from your AI assistant.',
    github: 'https://github.com/patchwindow/seo-mcp',
    npm: 'https://www.npmjs.com/package/@patchwindow/seo-mcp',
    tag: 'MCP server',
  },
  {
    name: 'patch-window-mcp',
    description:
      'MCP server that exposes Patch Window articles as structured context for Claude and other LLM clients. Query by format, tag, or slug directly from your AI assistant.',
    github: 'https://github.com/patchwindow/patchwindow-mcp',
    npm: 'https://www.npmjs.com/package/patch-window-mcp',
    tag: 'MCP server',
  },
]

export default function ToolsPage() {
  return (
    <>
      <InnerHeader />
      <main
        id="main-content"
        className="site-wrapper"
        style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Tools' }]} />
        <div className="page-header">
          <h1 className="page-header__title">Tools</h1>
          <p className="page-header__description">
            Open-source utilities published under the{' '}
            <a
              href="https://github.com/patchwindow"
              target="_blank"
              rel="noopener noreferrer"
            >
              patchwindow
            </a>{' '}
            GitHub organisation. Built for sysadmins, platform engineers, and homelab operators.
          </p>
        </div>

        <ul className="tool-list" aria-label="Published tools">
          {tools.map((tool) => (
            <li key={tool.name} className="tool-card">
              <div className="tool-card__header">
                <span className="tool-card__tag">{tool.tag}</span>
              </div>
              <h2 className="tool-card__name">
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-umami-event="tool-click"
                  data-umami-event-tool={tool.name}
                  data-umami-event-dest="github"
                >
                  {tool.name}
                </a>
              </h2>
              <p className="tool-card__description">{tool.description}</p>
              <div className="tool-card__links">
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tool-card__link"
                  data-umami-event="tool-click"
                  data-umami-event-tool={tool.name}
                  data-umami-event-dest="github"
                >
                  GitHub
                </a>
                {tool.npm && (
                  <>
                    <span aria-hidden="true" style={{ color: 'var(--color-border)' }}>·</span>
                    <a
                      href={tool.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tool-card__link"
                      data-umami-event="tool-click"
                      data-umami-event-tool={tool.name}
                      data-umami-event-dest="npm"
                    >
                      npm
                    </a>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <InnerFooter />
    </>
  )
}
