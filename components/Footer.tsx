'use client'

import Link from 'next/link'
import { SITE_STATS } from '@/lib/site-config'
import { useConsent } from '@/lib/consent'

export default function Footer() {
  const year = new Date().getFullYear()
  const { openBanner } = useConsent()

  return (
    <div className="site-wrapper">
    <footer className="v2-footer" role="contentinfo">
      <span>
        <span aria-hidden="true">{'$ '}</span>
        {`© ${year} Daniel Gustafsson · `}
        <Link href="/about" data-umami-event="nav-click" data-umami-event-item="about">
          About
        </Link>
        {' · '}
        <Link href="/corrections" data-umami-event="nav-click" data-umami-event-item="corrections">
          Corrections
        </Link>
        {' · '}
        <Link href="/feed.xml" data-umami-event="rss-click">
          RSS
        </Link>
        {' · '}
        <a href="mailto:daniel@serverdigital.net" data-umami-event="contact-click">
          Contact
        </a>
        {' · '}
        <button
          type="button"
          onClick={openBanner}
          aria-label="Open cookie settings"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          Cookie settings
        </button>
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
        <span aria-hidden="true">patch {SITE_STATS.currentPatch} applied</span>
        <span className="visually-hidden">Patch Window {SITE_STATS.currentPatch}</span>
        {' · '}
        <a
          href="https://ko-fi.com/M4M41XYZRX"
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="kofi-click"
          aria-label="Support on Ko-fi"
        >
          Ko-fi
        </a>
      </span>
    </footer>
    </div>
  )
}
