'use client'

import { useState } from 'react'
import { slugToTitle } from '@/lib/types'

const DEFAULT_VISIBLE = 10

interface TagCount {
  tag: string
  count: number
}

interface Props {
  tags: TagCount[]
}

export default function TagCloud({ tags }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (tags.length === 0) return null

  const visibleTags = expanded ? tags : tags.slice(0, DEFAULT_VISIBLE)
  const hasMore = tags.length > DEFAULT_VISIBLE

  return (
    <section className="v2-side__block" aria-labelledby="tag-cloud-heading">
      <h3 id="tag-cloud-heading" className="v2-side__heading">
        Tags
      </h3>
      <ul
        id="tag-cloud-list"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.375rem',
        }}
      >
        {visibleTags.map(({ tag, count }) => {
          const label = slugToTitle(tag)
          return (
            <li key={tag}>
              <a
                href={`/tag/${tag}`}
                className="tag-pill"
                aria-label={`${label} (${count} article${count !== 1 ? 's' : ''})`}
              >
                {label}
                <span
                  style={{
                    marginLeft: '0.3em',
                    fontSize: '0.7em',
                    color: 'var(--color-text-muted)',
                  }}
                  aria-hidden="true"
                >
                  {count}
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="tag-cloud-list"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: '0.625rem',
            padding: '0.2em 0.5em',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: '3px',
            background: 'transparent',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.color = 'var(--color-text)'
            el.style.borderColor = 'var(--color-text-muted)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.color = 'var(--color-text-muted)'
            el.style.borderColor = 'var(--color-border)'
          }}
        >
          {expanded
            ? '← Show less'
            : `Show all tags → (${tags.length - DEFAULT_VISIBLE} more)`}
        </button>
      )}
    </section>
  )
}
