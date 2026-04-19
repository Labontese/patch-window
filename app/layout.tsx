import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import { safeJsonLd } from '@/lib/jsonld'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['700'],
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
  weight: ['400', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
})

const SITE_URL = 'https://patchwindow.serverdigital.net'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Patch Window',
    template: '%s | Patch Window',
  },
  description:
    'Linux, networking, containers, DevOps, and AI in production environments. Written by a practitioner.',
  openGraph: {
    siteName: 'Patch Window',
    locale: 'en_US',
    type: 'website',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@DanneGsson',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://patchwindow.serverdigital.net/feed.xml',
    },
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Patch Window',
  url: SITE_URL,
  logo: `${SITE_URL}/logo/glyph-window.svg`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'editorial',
    email: 'daniel@serverdigital.net',
  },
  sameAs: ['https://github.com/holmdigital'],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Patch Window',
  url: SITE_URL,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // FOUC-prevention: runs synchronously before hydration to set data-theme
  const themeScript = `(function(){try{var p=JSON.parse(localStorage.getItem('pw-prefs')||'{}');var t=p.theme;if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: light)').matches){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <script
          defer
          src="https://analytics.holmdigital.se/script.js"
          data-website-id="2e94eb8f-6fe9-47d6-b1af-a8485f65d4ba"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(websiteJsonLd),
          }}
        />
      </body>
    </html>
  )
}
