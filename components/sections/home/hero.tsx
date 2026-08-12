'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import {
  MotionButton,
  ctaTapSpring,
  fadeUp,
  staggerContainer,
  useIsMobileViewport,
  usePrefersReducedMotion,
} from '@/lib/motion'
import { media } from '@/lib/media'

const heroStagger = staggerContainer(0.09, 0.12)

export function Hero() {
  const wrapperRef = useRef<HTMLElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const isMobile = useIsMobileViewport()
  // No mobile o encolher-e-arredondar em scroll (borderRadius animado força
  // repaint a cada frame) e o zoom Ken Burns infinito no fundo saem —
  // aparelhos mais fracos sentiam isso como lag ao rolar a página. No
  // desktop o efeito completo continua.
  const heavyMotion = !reduceMotion && !isMobile

  // O wrapper é mais alto que a tela — enquanto se rola por essa sobra, o
  // quadro do Hero permanece fixo no topo e encolhe com o scroll. Altura e
  // faixa de scroll ficam iguais em mobile/desktop (mudar isso depois da
  // hidratação, quando `isMobile` é detectado, causaria um salto de layout
  // visível — só o `style` animado abaixo é que liga/desliga).
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.88])
  const radius = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 28])

  // Revelação sutil da faixa de estrada no fechamento do Hero
  const roadReveal = useTransform(scrollYProgress, [0.5, 1], reduceMotion ? [1, 1] : [0, 1])

  return (
    <section ref={wrapperRef} id="top" className="relative h-[175svh] bg-navy">
      <motion.div
        style={heavyMotion ? { scale, borderRadius: radius } : undefined}
        className="sticky top-0 isolate flex h-svh w-full origin-center flex-col justify-between overflow-hidden bg-navy shadow-[0_60px_120px_-40px_rgba(11,26,40,0.85)]"
      >
        {/* Fotografia real da BUSFEEST: com tratamento sutil para valorizar o ônibus real e as montanhas de Minas */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={heavyMotion ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        >
          <Image
            src={media.heroBackground}
            alt="Ônibus de viagem da Busfeest percorrendo uma estrada entre as montanhas do sul de Minas Gerais"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-95 contrast-105"
          />
        </motion.div>

        {/* Gradiente natural editorial (sem escurecer excessivamente a foto real) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30 md:bg-gradient-to-r md:from-navy/95 md:via-navy/65 md:to-transparent"
        />

        {/* Marcador de Trajeto Superior */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 md:px-8 md:pt-28 flex justify-between items-center text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue" />
            </span>
            <span>01 · EMBARQUE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>ALFENAS — SUL DE MINAS GERAIS</span>
          </div>
        </div>

        {/* Bloco Principal de Conteúdo Editorial */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 pt-8 md:px-8 md:pb-16">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="show"
            variants={heroStagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-blue drop-shadow-sm"
            >
              TURISMO LOW COST & FRETAMENTO DE GRUPOS
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-4 text-balance text-4xl font-extrabold leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              A viagem começa
              <br />
              <span className="editorial-accent text-blue">no seu scroll.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-pretty text-base font-light leading-relaxed text-gray sm:text-xl"
            >
              Há quase 6 anos conectando turmas, empresas, igrejas e famílias pelas
              estradas do Sul de Minas Gerais. Viagens em grupo com preço justo e a
              segurança de quem é da região.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <WhatsappCta message="Olá! Quero um orçamento de viagem com a Busfeest.">
                Orçar pelo WhatsApp
              </WhatsappCta>
              <MotionButton
                variant="cta-outline"
                size="cta"
                nativeButton={false}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={ctaTapSpring}
                render={<Link href="/rotas" />}
              >
                Ver destinos & rotas
                <ChevronMark className="h-4 w-4" />
              </MotionButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Trajetória Editorial Integrada (Anti-Card, Fio de Estrada Fluido) */}
        <div className="relative z-10 border-t border-white/10 bg-navy/60 backdrop-blur-sm py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs font-semibold uppercase tracking-wider text-gray md:px-8">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
              <span className="flex items-center gap-2 shrink-0 text-white">
                <span className="text-blue font-bold">+6</span> Anos de Estrada
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 shrink-0 text-white">
                <span className="text-blue font-bold">100%</span> Foco em Grupos
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 shrink-0 text-white">
                Base em <span className="text-white font-bold">Alfenas — MG</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-blue">
              <span>A estrada continua</span>
              <motion.span
                aria-hidden="true"
                animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <ChevronMark className="h-3.5 w-3.5 rotate-90" />
              </motion.span>
            </div>
          </div>
        </div>

        {/* Faixa de Estrada revelada no scroll */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: roadReveal, transformOrigin: 'left' }}
          className="road-dashes absolute inset-x-0 bottom-0 z-20 h-1.5 opacity-90"
        />
      </motion.div>
    </section>
  )
}

