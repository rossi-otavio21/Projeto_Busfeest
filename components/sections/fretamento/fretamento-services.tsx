'use client'

import { motion } from 'framer-motion'
import { Plane, Mountain, Users, Route } from 'lucide-react'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { slideFromLeft, slideFromRight, useReveal } from '@/lib/motion'

const services: Array<{
  icon: typeof Users
  title: string
  description: string
  featured?: boolean
}> = [
  {
    icon: Users,
    title: 'Fretamento para Grupos',
    description:
      'Atléticas, igrejas, empresas e famílias. Fretamento sob medida para o tamanho e a rota do seu grupo — o coração do que fazemos.',
    featured: true,
  },
  {
    icon: Mountain,
    title: 'Turismo Regional & Excursões',
    description:
      'Roteiros pelo sul de Minas e destinos próximos: circuitos, cachoeiras, eventos e passeios em grupo.',
  },
  {
    icon: Plane,
    title: 'Translado de Aeroportos',
    description: 'Horários combinados e pontualidade nos principais aeroportos da região.',
  },
  {
    icon: Route,
    title: 'Conexão entre Cidades',
    description: 'Ligações regulares e sob demanda entre as cidades que atendemos.',
  },
]

export function FretamentoServices() {
  const revealLeft = useReveal(slideFromLeft)
  const revealRight = useReveal(slideFromRight)

  return (
    <section className="bg-white">
      {services.map((service, index) => {
        const flipped = index % 2 === 1
        const reveal = flipped ? revealRight : revealLeft
        return (
          <motion.article
            key={service.title}
            {...reveal}
            className={`border-b border-border py-16 md:py-20 ${
              service.featured ? 'bg-navy text-white' : 'bg-white text-navy'
            }`}
          >
            <div
              className={`mx-auto flex max-w-6xl flex-col gap-6 px-4 md:px-6 ${
                flipped ? 'md:flex-row-reverse md:items-end' : 'md:flex-row md:items-end'
              } md:justify-between`}
            >
              <div className={service.featured ? 'max-w-2xl' : 'max-w-xl'}>
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center ${
                    service.featured ? 'bg-blue text-white' : 'bg-navy text-white'
                  }`}
                >
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2
                  className={`mt-5 text-balance font-extrabold leading-[1.02] tracking-tight ${
                    service.featured ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'
                  }`}
                >
                  {service.title}
                </h2>
                <p
                  className={`mt-4 max-w-md text-pretty font-light leading-relaxed ${
                    service.featured ? 'text-lg text-gray' : 'text-base text-muted-foreground'
                  }`}
                >
                  {service.description}
                </p>
              </div>

              <WhatsappCta
                message={`Olá! Quero solicitar um orçamento: ${service.title}.`}
                variant={service.featured ? 'cta' : 'cta-outline-dark'}
                size="cta-md"
              >
                Solicitar orçamento
                <ChevronMark className="h-4 w-4" />
              </WhatsappCta>
            </div>
          </motion.article>
        )
      })}
    </section>
  )
}
