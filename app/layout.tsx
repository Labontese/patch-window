import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
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
  },
  robots: {
    index: true,
    follow: true,
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
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'editorial',
    email: 'daniel@serverdigital.net',
  },
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
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </body>
    </html>
  )
}
