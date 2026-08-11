'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { InstagramGlyph, WhatsappGlyph } from '@/components/brand/icons'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { fadeUp, slideFromRight, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'
import { site, whatsappLink } from '@/lib/site'

const headerStagger = staggerContainer(0.09, 0.1)

export function ContatoInfo() {
  const headerReveal = useReveal(headerStagger)
  const channelsReveal = useReveal(staggerContainer(0.08, 0.35))
  const photoReveal = useReveal(slideFromRight)
  const whatsapp = whatsappLink('Olá! Vim pelo site da Busfeest e quero falar com vocês.')

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-16 md:px-8 md:pb-0 md:pt-44">
        <div>
          <motion.div {...headerReveal} className="max-w-xl">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
            >
              <span className="h-1.5 w-6 rounded-full bg-blue" />
              <span>Contato</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
            >
              Fale com a gente e receba <span className="editorial-accent text-blue">seu orçamento.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-pretty text-lg font-light leading-relaxed text-gray"
            >
              Conte o que precisa — data, destino e quantas pessoas — e
              respondemos direto pelo WhatsApp.
            </motion.p>
          </motion.div>

          <motion.div {...channelsReveal} className="mt-10 max-w-xl">
            {/* WhatsApp: canal principal, visualmente dominante — exceção
                deliberada à paleta (verde da marca) porque reconhecer
                "isso é WhatsApp" à primeira vista é o objetivo. */}
            <motion.a
              variants={fadeUp}
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-6 transition-colors hover:bg-[#25D366]/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              <WhatsappGlyph className="h-14 w-14 shrink-0 drop-shadow-[0_0_16px_rgba(37,211,102,0.55)] transition-transform duration-300 group-hover:scale-105" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25D366]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" />
                  </span>
                  Responde na hora
                </span>
                <span className="mt-1 block text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {site.whatsapp.display}
                </span>
              </span>
              <ChevronMark className="h-6 w-6 shrink-0 text-[#25D366] transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              variants={fadeUp}
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 flex items-center gap-5 rounded-2xl border border-white/10 p-6 transition-colors hover:border-white/20 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              <InstagramGlyph
                variant="gradient"
                className="h-9 w-9 shrink-0 drop-shadow-[0_0_12px_rgba(214,41,118,0.45)] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold tracking-tight text-white">
                  {site.instagram.handle}
                </span>
                <span className="text-sm font-light text-gray">
                  Bastidores das viagens e novidades
                </span>
              </span>
              <ChevronMark className="h-5 w-5 shrink-0 text-gray transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>

            <motion.div variants={fadeUp} className="mt-6 flex items-center gap-3 px-1 text-sm text-gray">
              <MapPin className="h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
              Base em {site.base} — atendimento para todo o sul de Minas Gerais
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <WhatsappCta
                message="Olá! Quero um orçamento de transporte com a Busfeest."
                size="cta-lg"
              >
                Orçar pelo WhatsApp
              </WhatsappCta>
            </motion.div>
          </motion.div>
        </div>

        {/* Humaniza o contato: gente de verdade que já viajou com a Busfeest,
            não um ícone/ilustração. Full-bleed, sem moldura de card. */}
        <motion.div {...photoReveal} className="relative h-72 overflow-hidden md:h-[36rem]">
          <Image
            src={media.contactPhoto}
            alt="Grupo de estudantes reais ao lado de uma van da Busfeest durante o Unigames 2026"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: '50% 75%', transform: 'scale(2.2)', transformOrigin: '50% 75%' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-navy/20"
          />
        </motion.div>
      </div>
    </section>
  )
}
