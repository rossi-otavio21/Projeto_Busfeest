'use client'

import { motion } from 'framer-motion'
import { Plane, Mountain, Users, Route } from 'lucide-react'
import { ChevronMark } from '@/components/brand/chevron'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'

const services = [
  {
    icon: Plane,
    title: 'Translado de Aeroportos',
    description:
      'Levamos e buscamos seu grupo nos principais aeroportos da região, com horários combinados e pontualidade.',
  },
  {
    icon: Mountain,
    title: 'Turismo Regional & Excursões',
    description:
      'Roteiros pelo sul de Minas e destinos próximos: circuitos, cachoeiras, eventos e passeios em grupo.',
  },
  {
    icon: Users,
    title: 'Fretamento para Grupos',
    description:
      'Atléticas, igrejas, empresas e famílias. Fretamento sob medida para o tamanho e a rota do seu grupo.',
  },
  {
    icon: Route,
    title: 'Conexão entre Cidades',
    description:
      'Ligações regulares e sob demanda entre as cidades que atendemos, conectando o sul de Minas.',
  },
]

const gridStagger = staggerContainer(0.07)

export function Services() {
  const listReveal = useReveal(gridStagger)

  return (
    <section id="servicos" className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Serviços
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Do aeroporto à excursão, a gente leva seu grupo
          </h2>
        </div>

        <motion.ul {...listReveal} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <motion.li
              key={service.title}
              variants={fadeUp}
              className="group relative flex flex-col rounded-2xl bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Ícone dentro de badge navy (grafismo da marca) */}
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-blue">
                <service.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-navy">
                {service.title}
              </h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <ChevronMark className="mt-4 h-4 w-4 text-blue opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
