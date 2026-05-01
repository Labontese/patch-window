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
