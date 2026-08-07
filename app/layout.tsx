import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import { MotionProvider } from '@/components/motion-provider'
import { site, siteUrl } from '@/lib/site'
import './globals.css'

// Fonte oficial da marca — Sora, com os pesos aprovados no manual.
const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
})

const title = 'Busfeest | O transporte que cabe no seu orçamento'
const description =
  'Transporte rodoviário de passageiros e turismo low cost no sul de Minas Gerais. Fretamento para grupos, excursões, translado de aeroporto e conexão entre cidades com preço justo e segurança.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Busfeest',
    'fretamento',
    'turismo',
    'transporte',
    'sul de Minas Gerais',
    'Alfenas',
    'excursão',
    'translado aeroporto',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description:
      'Turismo low cost e fretamento para grupos no sul de Minas Gerais. Orce agora pelo WhatsApp.',
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: site.name,
    images: [
      {
        url: '/images/hero-bus.png',
        width: 1200,
        height: 675,
        alt: 'Ônibus de viagem da Busfeest percorrendo uma estrada entre as montanhas do sul de Minas Gerais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description:
      'Turismo low cost e fretamento para grupos no sul de Minas Gerais.',
    images: ['/images/hero-bus.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#122B42',
}

// Dados estruturados (JSON-LD) para busca local: ajuda o Google a entender
// que a Busfeest é uma empresa de transporte/turismo com base em Alfenas-MG.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: site.name,
  description,
  url: siteUrl,
  telephone: `+${site.whatsapp.number}`,
  areaServed: 'Sul de Minas Gerais',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Alfenas',
    addressRegion: 'MG',
    addressCountry: 'BR',
  },
  sameAs: [site.instagram.url],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} bg-background`}>
      <body className="font-sans antialiased">
        <a
          href="#conteudo-principal"
          className="sr-only rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>{children}</MotionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
