import type { Metadata } from 'next'
import { FretamentoHero } from '@/components/sections/fretamento/fretamento-hero'
import { FretamentoPhotoBand } from '@/components/sections/fretamento/fretamento-photo-band'
import { FretamentoServices } from '@/components/sections/fretamento/fretamento-services'

export const metadata: Metadata = {
  title: 'Fretamento | Busfeest',
  description:
    'Fretamento de ônibus e vans para grupos: turismo, eventos, escolas, igrejas, empresas e translado de aeroportos. Orçamento rápido pelo WhatsApp.',
  alternates: { canonical: '/fretamento' },
}

export default function FretamentoPage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <FretamentoHero />
      <FretamentoPhotoBand />
      <FretamentoServices />
    </main>
  )
}
