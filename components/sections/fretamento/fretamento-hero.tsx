'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

const headerStagger = staggerContainer(0.09, 0.1)

export function FretamentoHero() {
  const contentReveal = useReveal(headerStagger)

  return (
    <section className="relative overflow-hidden bg-navy pb-20 pt-36 md:pb-28 md:pt-48">
      {/* Background fotográfico sutil com o ônibus real BUSFEEST */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src={media.heroBackground}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-90 contrast-105"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/50" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...contentReveal} className="max-w-3xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue">
            <span className="h-2 w-2 rounded-full bg-blue" />
            <span>FRETAMENTO EXCLUSIVO DE GRUPOS</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-4 text-balance text-4xl font-extrabold leading-[0.94] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Transporte <span className="editorial-accent text-blue">sob medida</span> para o seu grupo.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-pretty text-lg font-light leading-relaxed text-gray sm:text-xl"
          >
            Quatro modalidades, de excursão de fim de semana a linha fixa diária. Você define a rota e os horários — a gente garante o veículo do tamanho certo e o melhor preço.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <WhatsappCta message="Olá! Quero solicitar um orçamento de fretamento com a Busfeest.">
              Orçar pelo WhatsApp
            </WhatsappCta>
          </motion.div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="road-dashes absolute inset-x-0 bottom-0 h-1.5 opacity-80" />
    </section>
  )
}

