'use client'

import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { drawLine, fadeUp, staggerContainer, useReveal } from '@/lib/motion'

const headerStagger = staggerContainer(0.09, 0.1)

export function FretamentoHero() {
  const contentReveal = useReveal(headerStagger)
  const lineReveal = useReveal(drawLine)

  return (
    <section className="relative bg-navy pb-16 pt-32 md:pb-24 md:pt-44">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div {...contentReveal} className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-blue"
          >
            Fretamento
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
          >
            Transporte sob medida para o tamanho do seu grupo.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray"
          >
            Turismo, eventos, escolas, igrejas, empresas e aeroportos. Você
            conta o que precisa, a gente monta a rota e o orçamento — sem
            burocracia.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <WhatsappCta message="Olá! Quero solicitar um orçamento de fretamento com a Busfeest.">
              Solicitar orçamento
            </WhatsappCta>
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        {...lineReveal}
        style={{ transformOrigin: 'left' }}
        className="road-dashes mt-16 h-1.5 opacity-70"
      />
    </section>
  )
}
