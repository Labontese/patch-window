import { NOW_NOTE } from '@/lib/now'

export default function NowCard() {
  return (
    <section className="v2-side__block" aria-labelledby="now-card-heading">
      <h2 id="now-card-heading" className="v2-side__heading">
        /now
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '0.4rem' }}>{NOW_NOTE.line1}</li>
        <li style={{ marginBottom: '0.4rem' }}>{NOW_NOTE.line2}</li>
        <li>{NOW_NOTE.line3}</li>
      </ul>
      <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        Updated{' '}
        <time dateTime={NOW_NOTE.updated}>
          {new Date(NOW_NOTE.updated).toLocaleDateString('en-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </p>
    </section>
  )
}
