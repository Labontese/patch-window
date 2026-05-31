import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Required for Docker multi-stage standalone build
  output: 'standalone',
  // Fail loud on missing env-vars — no silent fallback in production
  env: {},
  async headers() {
    return [
      {
        source: '/.well-known/traffic-advice',
        headers: [{ key: 'Content-Type', value: 'application/trafficadvice+json' }],
      },
      // robots.txt and sitemap.xml must NOT carry Next.js RSC Vary headers.
      // Bingbot (and other crawlers) do not send RSC negotiation headers, so a
      // Vary: RSC, Next-Router-State-Tree, ... on these resources confuses
      // crawlers and can prevent Bing from ever processing them.
      {
        source: '/robots.txt',
        headers: [
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Vary', value: 'Accept-Encoding' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.png',
        permanent: false,
      },
      // 404-bortstadning fran URL-strukturskifte april 2026
      // commit b9af02f (29 april): /format/<format> togs bort till forman for /<format>
      // commit 93a299d (19 april): /articles/<format>/<slug> bytt till /<format>/<slug>
      {
        source: '/format/:format',
        destination: '/:format',
        permanent: true,
      },
      {
        source: '/articles/:format/:slug',
        destination: '/:format/:slug',
        permanent: true,
      },
      {
        source: '/articles/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // commit b5293c1 (17 may): the "guide" format was renamed to "guides".
      // /guide/<slug> now 404s but is still crawled by Google (e.g.
      // /guide/wazuh-cluster-hardening-2026). 301 every singular /guide/<slug>
      // to its /guides/<slug> canonical.
      {
        source: '/guide/:slug',
        destination: '/guides/:slug',
        permanent: true,
      },
    ]
  },
}

/** @type {import('rehype-pretty-code').Options} */
const rehypePrettyCodeOptions = {
  theme: {
    dark: 'vesper',
    light: 'github-light',
  },
  keepBackground: true,
}

const withMDX = createMDX({
  options: {
    // remarkFrontmatter strippar YAML-blocket så det inte renderas som brödtext.
    // Frontmattern läses separat i lib/articles.ts via gray-matter.
    remarkPlugins: [[remarkFrontmatter, ['yaml']], remarkGfm],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
})

export default withMDX(nextConfig)
