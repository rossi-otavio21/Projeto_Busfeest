import type { Metadata } from 'next'
import { ViagensHero } from '@/components/sections/viagens/viagens-hero'
import { ViagensList } from '@/components/sections/viagens/viagens-list'
import { ViagensGallery } from '@/components/sections/viagens/viagens-gallery'

export const metadata: Metadata = {
  title: 'Viagens | Busfeest',
  description:
    'Excursões e viagens em grupo com a Busfeest pelo sul de Minas Gerais e além. Preço justo e segurança do embarque ao desembarque.',
  alternates: { canonical: '/viagens' },
}

export default function ViagensPage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <ViagensHero />
      <ViagensList />
      <ViagensGallery />
    </main>
  )
}
