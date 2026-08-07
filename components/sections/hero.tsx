'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { MotionButton, ctaTapSpring, fadeUp, staggerContainer } from '@/lib/motion'

const stats = [
  { value: '+6', label: 'anos de estrada' },
  { value: '6', label: 'destinos atendidos' },
  { value: '100%', label: 'foco em grupos' },
]

const heroStagger = staggerContainer(0.08, 0.1)

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-navy"
    >
      {/* Imagem de fundo: estrada no sul de Minas — leve zoom contínuo, puramente decorativo.
          O MotionConfig (components/motion-provider.tsx) já desliga isso sob prefers-reduced-motion. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: 1.06 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
      >
        <Image
          src="/images/hero-bus.png"
          alt="Ônibus de viagem da Busfeest percorrendo uma estrada entre as montanhas do sul de Minas Gerais ao entardecer"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* Overlay navy p/ contraste do texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate="show"
          variants={heroStagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray"
          >
            <MapPin className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
            Turismo low cost · Sul de Minas Gerais
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl"
          >
            O transporte que cabe no seu{' '}
            <span className="text-blue">orçamento.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray"
          >
            Há quase 6 anos levando turmas, igrejas, empresas e famílias pelas
            estradas do sul de Minas. Viagens em grupo com preço justo, sem abrir
            mão da segurança.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsappCta message="Olá! Quero um orçamento de transporte com a Busfeest.">
              Orçar pelo WhatsApp
            </WhatsappCta>
            <MotionButton
              variant="cta-outline"
              size="cta"
              nativeButton={false}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={ctaTapSpring}
              render={<a href="#rotas" />}
            >
              Ver rotas
              <ChevronMark className="h-4 w-4" />
            </MotionButton>
          </motion.div>

          {/* Indicadores rápidos */}
          <motion.dl variants={fadeUp} className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-white">{stat.value}</dd>
                <dd className="text-sm text-gray">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  )
}
