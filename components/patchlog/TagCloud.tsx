interface TagCount {
  tag: string
  count: number
}

interface Props {
  tags: TagCount[]
}

export default function TagCloud({ tags }: Props) {
  if (tags.length === 0) return null

  return (
    <section className="v2-side__block" aria-labelledby="tag-cloud-heading">
      <h3 id="tag-cloud-heading" className="v2-side__heading">
        Tags
      </h3>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.375rem',
        }}
      >
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <a
              href={`/tag/${tag}`}
              className="tag-pill"
              aria-label={`${tag} (${count} article${count !== 1 ? 's' : ''})`}
            >
              {tag}
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
        ))}
      </ul>
    </section>
  )
}
