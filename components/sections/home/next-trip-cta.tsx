'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

export function NextTripCta() {
  const contentReveal = useReveal(fadeUp)

  return (
    <section className="relative isolate overflow-hidden bg-navy-deep py-24 md:py-32">
      {/* Fecha o ciclo visual aberto pelo Hero — mesma foto, tratamento mais escuro/silencioso */}
      <Image
        src={media.finalCtaBackground}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/95 to-navy-deep/70"
      />

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

      <motion.div {...contentReveal} className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
          Fim de trajeto
        </span>
        <h2 className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl">
          Sua próxima viagem começa com uma mensagem.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray">
          Conte pra gente para onde seu grupo vai. Respondemos rápido e sem
          burocracia, direto no WhatsApp.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <WhatsappCta
            message="Olá! Quero fechar uma viagem com a Busfeest. Pode me passar um orçamento?"
            size="cta-lg"
          >
            Orçar pelo WhatsApp
          </WhatsappCta>
          <Link
            href="/contato"
            className="text-sm font-semibold text-gray underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            Ou veja todos os canais de contato
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
