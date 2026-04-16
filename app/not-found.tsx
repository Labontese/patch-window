import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="site-wrapper" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <h1>404</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Page not found.
        </p>
        <ul className="not-found-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/deep-dive">Deep Dives</Link></li>
          <li><Link href="/hot-take">Hot Takes</Link></li>
          <li><Link href="/brief">Briefs</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </main>
      <SiteFooter />
    </>
  )
}
