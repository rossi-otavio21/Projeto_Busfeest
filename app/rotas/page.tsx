import type { Metadata } from 'next'
import { RotasMap } from '@/components/sections/rotas/rotas-map'

export const metadata: Metadata = {
  title: 'Rotas | Busfeest',
  description:
    'Rotas atendidas pela Busfeest partindo de Alfenas-MG: 22 cidades no sul de Minas, Triângulo Mineiro e interior de São Paulo — de Belo Horizonte e Uberlândia a Ribeirão Preto, Campinas e São Paulo, mais conexões sob medida com aeroportos regionais.',
  alternates: { canonical: '/rotas' },
}

export default function RotasPage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <RotasMap />
    </main>
  )
}
