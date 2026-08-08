'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'

// Não é um grid de cards: é uma lista editorial de linhas cheias, cada uma
// levando para a página que de fato responde a essa pergunta — a Home aponta,
// não tenta conter a resposta inteira.
const stops = [
  {
    index: '01',
    label: 'Viagens',
    href: '/viagens',
    description: 'Excursões e passeios em grupo pelo sul de Minas e além.',
  },
  {
    index: '02',
    label: 'Fretamento',
    href: '/fretamento',
    description: 'Transporte sob medida para grupos, empresas, igrejas e eventos.',
  },
  {
    index: '03',
    label: 'Rotas',
    href: '/rotas',
    description: 'De Alfenas para onde você precisar — veja os destinos já atendidos.',
  },
]

const listStagger = staggerContainer(0.08)

export function Highlights() {
  const listReveal = useReveal(listStagger)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
          Continue a viagem
        </span>

        <motion.ul {...listReveal} className="mt-8 border-t border-border">
          {stops.map((stop) => (
            <motion.li key={stop.href} variants={fadeUp} className="border-b border-border">
              <Link
                href={stop.href}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue md:grid-cols-[3rem_auto_1fr_auto] md:gap-8"
              >
                <span className="hidden font-mono text-sm text-muted-foreground md:block">
                  {stop.index}
                </span>
                <span className="text-3xl font-bold tracking-tight text-navy transition-colors group-hover:text-blue md:text-5xl">
                  {stop.label}
                </span>
                <span className="hidden max-w-sm text-base font-light leading-relaxed text-muted-foreground md:block">
                  {stop.description}
                </span>
                <ChevronMark className="h-6 w-6 shrink-0 text-blue transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="pb-6 text-sm font-light leading-relaxed text-muted-foreground md:hidden">
                {stop.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
