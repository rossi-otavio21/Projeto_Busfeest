'use client'

import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'

const headerStagger = staggerContainer(0.09, 0.1)

export function ViagensHero() {
  const contentReveal = useReveal(headerStagger)

  return (
    <section className="bg-navy pb-16 pt-32 md:pb-20 md:pt-44">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div {...contentReveal} className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-blue"
          >
            Viagens
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
          >
            Para onde vamos?
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray"
          >
            Excursões, passeios e viagens em grupo pelo sul de Minas e além —
            organizadas com o mesmo cuidado de sempre: preço justo e segurança
            do embarque ao desembarque.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <WhatsappCta message="Olá! Quero saber sobre as próximas viagens da Busfeest.">
              Saber das próximas viagens
            </WhatsappCta>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
