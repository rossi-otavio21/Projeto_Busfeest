'use client'

import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, useReveal } from '@/lib/motion'

// Nenhuma viagem com data/valor confirmados existe ainda nos dados do
// projeto — em vez de inventar uma agenda, a seção assume o estado real e
// já fica pronta para receber viagens reais assim que existirem (basta
// trocar este bloco por uma lista, sem mudar o resto da página).
export function ViagensList() {
  const reveal = useReveal(fadeUp)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
          Próximas viagens
        </span>

        <motion.div
          {...reveal}
          className="mt-8 flex flex-col items-start gap-6 border-l-2 border-blue py-2 pl-6 md:flex-row md:items-center md:justify-between md:pl-8"
        >
          <div className="max-w-xl">
            <h2 className="text-balance text-2xl font-bold leading-tight text-navy md:text-3xl">
              Estamos montando a agenda da próxima temporada.
            </h2>
            <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground">
              Assim que uma viagem for confirmada — data, destino e valor —
              ela aparece aqui. Se você já sabe para onde quer ir, fale com a
              gente e montamos a excursão para o seu grupo.
            </p>
          </div>
          <WhatsappCta
            message="Olá! Quero organizar uma viagem/excursão com a Busfeest para o meu grupo."
            variant="cta-outline-dark"
            size="cta-md"
            className="shrink-0"
          >
            Organizar minha viagem
            <ChevronMark className="h-4 w-4" />
          </WhatsappCta>
        </motion.div>
      </div>
    </section>
  )
}
