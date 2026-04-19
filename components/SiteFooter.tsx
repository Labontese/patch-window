import Link from 'next/link'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-wrapper">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>© {year} Daniel Gustafsson / Patch Window</span>
          <a href='https://ko-fi.com/M4M41XYZRX' target='_blank' rel='noopener noreferrer' data-umami-event="kofi-click">
            <img height='36' width={143} style={{ border: '0px', height: '36px' }} src='https://storage.ko-fi.com/cdn/kofi3.png?v=6' alt='Buy Me a Coffee at ko-fi.com' />
          </a>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/about" className="nav-link" style={{ fontSize: '0.8125rem' }} data-umami-event="nav-click" data-umami-event-item="about">
              About
            </Link>
            <Link href="/corrections" className="nav-link" style={{ fontSize: '0.8125rem' }} data-umami-event="nav-click" data-umami-event-item="corrections">
              Corrections
            </Link>
            <Link href="/feed.xml" className="nav-link" style={{ fontSize: '0.8125rem' }} data-umami-event="rss-click">
              RSS
            </Link>
            <a href="mailto:daniel@serverdigital.net" className="nav-link" style={{ fontSize: '0.8125rem' }} data-umami-event="contact-click">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
