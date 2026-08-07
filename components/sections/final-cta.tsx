'use client'

import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, useReveal } from '@/lib/motion'

export function FinalCta() {
  const contentReveal = useReveal(fadeUp)

  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 md:py-28">
      {/* Grafismo de estrada tracejada em diagonal ao fundo — única seção com o
          movimento contínuo da faixa, sugerindo "a estrada continua" no fechamento. */}
      <div
        aria-hidden="true"
        className="road-dashes road-dashes-marquee pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 bg-blue/15 [clip-path:polygon(0_0,100%_0,100%_100%)]"
      />

      <motion.div {...contentReveal} className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-balance text-3xl font-bold leading-tight text-white md:text-5xl">
          O transporte que cabe no seu orçamento.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray">
          Conte pra gente para onde seu grupo vai. Respondemos rápido e sem
          burocracia, direto no WhatsApp.
        </p>
        <WhatsappCta
          message="Olá! Quero fechar uma viagem com a Busfeest. Pode me passar um orçamento?"
          size="cta-lg"
          className="mt-8"
        >
          Orçar pelo WhatsApp
        </WhatsappCta>
      </motion.div>
    </section>
  )
}
