export const PATHWAYS = [
  'aiops-observability',
  'sysadmin-craft',
  'infrastructure-strategy',
  'devops-culture',
  'homelab-edge',
  'accessibility',
] as const

export type Pathway = (typeof PATHWAYS)[number]

// Friendly display names for pathways. Used in <title>, <h1>, and badges.
// Keep curated rather than slug-derived so we get correct casing for
// terms like "AIOps" and natural ampersands.
export const PATHWAY_DISPLAY_NAMES: Record<Pathway, string> = {
  'aiops-observability': 'AIOps & Observability',
  'sysadmin-craft': 'Sysadmin Craft',
  'infrastructure-strategy': 'Infrastructure Strategy',
  'devops-culture': 'DevOps Culture',
  'homelab-edge': 'Homelab & Edge',
  accessibility: 'Accessibility',
}

export function getPathwayDisplayName(slug: string): string {
  if ((PATHWAYS as readonly string[]).includes(slug)) {
    return PATHWAY_DISPLAY_NAMES[slug as Pathway]
  }
  return slugToTitle(slug)
}

// Generic slug → "Title Case" helper for tags and unknown slugs.
// "container-runtime" → "Container Runtime"
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

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
