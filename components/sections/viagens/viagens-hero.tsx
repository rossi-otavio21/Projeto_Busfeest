'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

const headerStagger = staggerContainer(0.09, 0.1)

export function ViagensHero() {
  const contentReveal = useReveal(headerStagger)

  return (
    <section className="relative overflow-hidden bg-navy pb-16 pt-32 md:pb-20 md:pt-44">
      {/* Ônibus real da frota — mesma textura fotográfica sutil do hero de Fretamento */}
      <div className="absolute inset-0 opacity-40">
        <Image
          src={media.frotaOnibusEscola}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-90 contrast-105"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...contentReveal} className="max-w-3xl">
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
          >
            <span className="h-1.5 w-6 rounded-full bg-blue" />
            <span>Viagens</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
          >
            Para onde <span className="editorial-accent text-blue">vamos?</span>
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
