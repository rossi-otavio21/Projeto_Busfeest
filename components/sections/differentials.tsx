'use client'

import { motion } from 'framer-motion'
import { Wallet, ShieldCheck, UsersRound, Zap } from 'lucide-react'
import { fadeUp, iconPop, staggerContainer, useReveal } from '@/lib/motion'

const differentials = [
  {
    icon: Wallet,
    title: 'Preço justo',
    description:
      'Modelo low cost de verdade: você paga pelo que precisa, sem custos escondidos.',
  },
  {
    icon: ShieldCheck,
    title: 'Experiência de estrada',
    description:
      'Quase 6 anos rodando o sul de Minas com foco em chegar bem e com segurança.',
  },
  {
    icon: UsersRound,
    title: 'Foco em grupos',
    description:
      'Atléticas, igrejas e empresas: entendemos a logística de mover muita gente junto.',
  },
  {
    icon: Zap,
    title: 'Orçamento rápido',
    description:
      'Sem burocracia: você fala com a gente no WhatsApp e recebe o orçamento na hora.',
  },
]

const listStagger = staggerContainer(0.1)

export function Differentials() {
  const listReveal = useReveal(listStagger)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Por que viajar com a Busfeest
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Preço de low cost, cuidado de quem conhece a estrada
          </h2>
        </div>

        <motion.ul {...listReveal} className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {differentials.map((item) => (
            <motion.li key={item.title} variants={fadeUp} className="flex gap-5">
              <motion.span
                variants={iconPop}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-navy"
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </motion.span>
              <div>
                <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                <p className="mt-1.5 text-base font-light leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
