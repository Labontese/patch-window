import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'
import { safeJsonLd } from '@/lib/jsonld'
import ThemeToggle from '@/components/ThemeToggle'
import TweaksPanel from '@/components/TweaksPanel'
import ReadingProgress from '@/components/ReadingProgress'
import EasterEgg from '@/components/EasterEgg'
import ConsentBanner from '@/components/ConsentBanner'
import UmamiScript from '@/components/UmamiScript'
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
    // Note: Next.js automatically picks up app/opengraph-image.png as the
    // default OG image. We list it here too so it propagates to twitter.images
    // without each route having to re-declare it.
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Patch Window — Linux, AIOps, and the production homelab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@DanneGsson',
    images: ['/opengraph-image.png'],
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        <ReadingProgress />
        <ThemeToggle />
        <TweaksPanel />
        <EasterEgg />
        {children}
        <UmamiScript />
        <ConsentBanner />
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
