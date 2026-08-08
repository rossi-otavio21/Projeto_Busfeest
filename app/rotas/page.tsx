import type { Metadata } from 'next'
import { RotasMap } from '@/components/sections/rotas/rotas-map'

export const metadata: Metadata = {
  title: 'Rotas | Busfeest',
  description:
    'Rotas atendidas pela Busfeest partindo de Alfenas-MG: Ribeirão Preto, Belo Horizonte, São Paulo, Uberaba e conexões sob medida com aeroportos regionais.',
  alternates: { canonical: '/rotas' },
}

export default function RotasPage() {
  return (
    <main id="conteudo-principal" tabIndex={-1} className="outline-none">
      <RotasMap />
    </main>
  )
}
