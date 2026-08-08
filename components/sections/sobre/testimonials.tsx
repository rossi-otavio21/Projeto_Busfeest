'use client'

import { motion } from 'framer-motion'
import { fadeUp, slideFromLeft, slideFromRight, useReveal } from '@/lib/motion'

// Depoimentos reais recebidos de grupos que já viajaram com a Busfeest —
// não são inventados: vieram de feedbacks publicados pelas próprias
// atléticas parceiras nas redes.
const quotes = [
  {
    quote:
      'Queremos agradecer à empresa Busfeest pela excelente prestação de serviço durante o transporte dos atletas. O transporte estava muito bem limpo e conservado, e a pontualidade no embarque mostrou organização e responsabilidade. Também gostaria de ressaltar a educação e o profissionalismo do motorista, atencioso e cordial durante todo o percurso.',
    author: 'A.A.A.E.M.S.',
    role: 'Atlética de Medicina — Alfenas/MG',
  },
  {
    quote:
      'Amigo, não tenho nada a reclamar do transporte — os motoristas foram super legais e compreensivos, não atrasaram e ainda me ajudaram com várias dicas.',
    author: '@aaamuquirana',
    role: 'Atlética Muquirana',
  },
  {
    quote:
      'Estamos satisfeitos com o serviço que nos foi oferecido. Agradecemos o bom atendimento e consideramos a experiência geral garantida.',
    author: '@ldupocos',
    role: 'Grupo parceiro',
  },
]

export function Testimonials() {
  const eyebrowReveal = useReveal(fadeUp)
  const revealLeft = useReveal(slideFromLeft)
  const revealRight = useReveal(slideFromRight)

  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.span
          {...eyebrowReveal}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-blue"
        >
          Quem já rodou com a gente
        </motion.span>

        <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
          {quotes.map((item, index) => {
            const reveal = index % 2 === 0 ? revealLeft : revealRight
            return (
              <motion.figure
                key={item.author}
                {...reveal}
                className="grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
              >
                <blockquote className="text-pretty text-lg font-light leading-relaxed text-gray md:text-xl">
                  “{item.quote}”
                </blockquote>
                <figcaption className="whitespace-nowrap text-sm text-white md:text-right">
                  <span className="block font-semibold">{item.author}</span>
                  <span className="text-gray">{item.role}</span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>

        <p className="mt-10 text-sm font-light text-gray">
          Em 2026, atendemos as delegações do Unigames — a maior competição
          universitária do interior — chegando a transportar mais de 40
          passageiros por dia para uma única atlética parceira.
        </p>
      </div>
    </section>
  )
}
