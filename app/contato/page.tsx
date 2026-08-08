import type { Metadata } from 'next'
import { ContatoInfo } from '@/components/sections/contato/contato-info'

export const metadata: Metadata = {
  title: 'Contato | Busfeest',
  description:
    'Fale com a Busfeest pelo WhatsApp ou Instagram e receba um orçamento de fretamento ou viagem em grupo. Base em Alfenas-MG, atendimento para todo o sul de Minas Gerais.',
  alternates: { canonical: '/contato' },
}

export default function ContatoPage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <ContatoInfo />
    </main>
  )
}
