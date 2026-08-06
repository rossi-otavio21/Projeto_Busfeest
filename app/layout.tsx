import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'

// Fonte oficial da marca — Sora, com os pesos aprovados no manual.
const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Busfeest | O transporte que cabe no seu orçamento',
  description:
    'Transporte rodoviário de passageiros e turismo low cost no sul de Minas Gerais. Fretamento para grupos, excursões, translado de aeroporto e conexão entre cidades com preço justo e segurança.',
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
  generator: 'v0.app',
  openGraph: {
    title: 'Busfeest | O transporte que cabe no seu orçamento',
    description:
      'Turismo low cost e fretamento para grupos no sul de Minas Gerais. Orce agora pelo WhatsApp.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#122B42',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
