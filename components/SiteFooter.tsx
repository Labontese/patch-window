import Link from 'next/link'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-wrapper">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>© {year} Daniel Gustafsson / Patch Window</span>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/about" className="nav-link" style={{ fontSize: '0.8125rem' }}>
              About
            </Link>
            <Link href="/corrections" className="nav-link" style={{ fontSize: '0.8125rem' }}>
              Corrections
            </Link>
            <Link href="/feed.xml" className="nav-link" style={{ fontSize: '0.8125rem' }}>
              RSS
            </Link>
            <a href="mailto:daniel@serverdigital.net" className="nav-link" style={{ fontSize: '0.8125rem' }}>
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
