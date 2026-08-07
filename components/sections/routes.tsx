'use client'

import { motion } from 'framer-motion'
import { RouteChip } from '@/components/brand/chevron'
import { slideFromLeft, staggerContainer, useReveal } from '@/lib/motion'
import { whatsappLink } from '@/lib/site'

const chipStagger = staggerContainer(0.06)

// Rotas atendidas — partindo da base em Alfenas. Cores alternam na paleta.
const routes = [
  { from: 'Alfenas', to: 'Ribeirão Preto', color: 'navy' as const },
  { from: 'Alfenas', to: 'Uberaba', color: 'blue' as const },
  { from: 'Alfenas', to: 'São Paulo', color: 'navy' as const },
  { from: 'Alfenas', to: 'Belo Horizonte', color: 'blue' as const },
  { from: 'Sul de Minas', to: 'Conexão Aeroporto', color: 'navy' as const },
  { from: 'Sob medida', to: 'Seu destino', color: 'gray' as const },
]

export function Routes() {
  const whatsapp = whatsappLink(
    'Olá! Gostaria de saber sobre as rotas atendidas pela Busfeest.',
  )
  const listReveal = useReveal(chipStagger)

  return (
    <section id="rotas" className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Rotas atendidas
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
            Conectando o sul de Minas e além
          </h2>
          <p className="mt-4 text-lg font-light leading-relaxed text-gray">
            Com base em Alfenas, chegamos aos principais destinos da região — e
            montamos rotas sob medida para o seu grupo.
          </p>
        </div>

        <motion.ul {...listReveal} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <motion.li key={`${route.from}-${route.to}`} variants={slideFromLeft}>
              <RouteChip from={route.from} to={route.to} color={route.color} />
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-10 text-gray">
          Não encontrou seu destino?{' '}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            Fale com a gente pelo WhatsApp
          </a>{' '}
          e montamos a rota.
        </p>
      </div>
    </section>
  )
}
