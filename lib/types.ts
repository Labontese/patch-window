export const PATHWAYS = [
  'aiops-observability',
  'sysadmin-craft',
  'infrastructure-strategy',
  'devops-culture',
  'homelab-edge',
  'accessibility',
] as const

export type Pathway = (typeof PATHWAYS)[number]

export const FORMATS = ['hot-take', 'deep-dive', 'brief'] as const
export type Format = (typeof FORMATS)[number]

export interface ArticleFrontmatter {
  title: string
  format: Format
  slug: string
  pathway: Pathway
  tags: string[]
  publishedAt: string
  updatedAt?: string
  excerpt: string
  related?: Array<{ format: Format; slug: string }>
  draft?: boolean
  lang?: string
}

export interface ArticleMeta extends ArticleFrontmatter {
  readingTime?: number
}
