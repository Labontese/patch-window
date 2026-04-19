export default function Subscribe() {
  return (
    <section className="v2-side__block" aria-labelledby="subscribe-heading">
      <h3 id="subscribe-heading" className="v2-side__heading">
        Subscribe
      </h3>
      <p style={{ margin: '0 0 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        Follow via RSS. No email required, no tracking.
      </p>
      <a
        href="/feed.xml"
        className="nav-link"
        style={{ color: 'var(--color-amber)', fontSize: '0.875rem' }}
        aria-label="Subscribe via RSS feed"
      >
        <span aria-hidden="true">{'> '}</span>feed.xml
      </a>
    </section>
  )
}
