import type { Metadata } from 'next'
import { SobreHistoria } from '@/components/sections/sobre/sobre-historia'
import { Differentials } from '@/components/sections/sobre/differentials'
import { Testimonials } from '@/components/sections/sobre/testimonials'
import { SocialProof } from '@/components/sections/sobre/social-proof'

export const metadata: Metadata = {
  title: 'Sobre | Busfeest',
  description:
    'Há quase 6 anos a Busfeest transporta grupos pelo sul de Minas Gerais com preço justo e segurança. Conheça a história, os diferenciais e quem já viajou com a gente.',
  alternates: { canonical: '/sobre' },
}

export default function SobrePage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <SobreHistoria />
      <Differentials />
      <Testimonials />
      <SocialProof />
    </main>
  )
}
