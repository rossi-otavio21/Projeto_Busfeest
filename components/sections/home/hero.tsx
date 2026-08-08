'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import {
  MotionButton,
  ctaTapSpring,
  fadeUp,
  staggerContainer,
  usePrefersReducedMotion,
} from '@/lib/motion'
import { media } from '@/lib/media'

const stats = [
  { value: '+6', label: 'anos de estrada' },
  { value: '6', label: 'destinos atendidos' },
  { value: '100%', label: 'foco em grupos' },
]

const heroStagger = staggerContainer(0.09, 0.15)

export function Hero() {
  const wrapperRef = useRef<HTMLElement>(null)
  const reduceMotion = usePrefersReducedMotion()

  // O wrapper é mais alto que a tela — enquanto se rola por essa sobra, o
  // cartão do Hero (sticky) permanece fixo no topo e encolhe em resposta
  // direta ao progresso do scroll (sem easing/transition: valor de scroll
  // puro). Ele "sai de cena" como quem se afasta da janela do ônibus.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.86])
  const radius = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 32])

  // Traço de estrada que se revela perto do fim do encolhimento — a costura
  // visual que o Sobre retoma (mesmo grafismo, ver about.tsx). Sob reduced
  // motion, fica sempre visível (é presença, não movimento).
  const roadReveal = useTransform(scrollYProgress, [0.55, 1], reduceMotion ? [1, 1] : [0, 1])

  return (
    <section ref={wrapperRef} id="top" className="relative h-[170svh] bg-navy">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="sticky top-0 isolate flex h-svh w-full origin-center items-end overflow-hidden bg-navy shadow-[0_60px_120px_-40px_rgba(11,26,40,0.75)]"
      >
        {/* Imagem de fundo: ocupa o quadro inteiro, mas a máscara concentra o
            texto no navy sólido à esquerda — a foto domina os 2/3 direitos.
            Zoom lento contínuo, puramente decorativo (desligado sob
            prefers-reduced-motion pelo MotionConfig em motion-provider.tsx). */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale: 1.06 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        >
          <Image
            src={media.heroBackground}
            alt="Ônibus de viagem da Busfeest percorrendo uma estrada entre as montanhas do sul de Minas Gerais ao entardecer"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy from-5% via-navy/85 via-40% to-navy/0 to-75%"
        />

        {/* Indicador de trajeto — reforça a identidade de "estrada" sem ocupar espaço */}
        <div className="absolute right-6 top-28 z-10 hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 md:right-10 md:top-32 md:flex">
          Alfenas
          <span className="relative h-px w-14 bg-white/40">
            <span className="absolute -right-0.5 -top-[3px] h-[7px] w-[7px] rounded-full bg-blue" />
          </span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-36">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate="show"
          variants={heroStagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium tracking-[0.2em] text-gray/70"
          >
            21°25&apos;48&quot; S · 45°56&apos;50&quot; W — ALFENAS, MG
          </motion.p>

          <motion.span
            variants={fadeUp}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray"
          >
            <MapPin className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
            Turismo low cost · Sul de Minas Gerais
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-balance text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            A estrada começa
            <br />
            <span className="text-blue">no seu orçamento.</span>
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
              render={<Link href="/rotas" />}
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

        {/* Fim da estrada visível no Hero — o Sobre retoma esse mesmo traço. */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: roadReveal, transformOrigin: 'left' }}
          className="road-dashes absolute inset-x-0 bottom-0 z-10 h-1.5 opacity-80"
        />
      </motion.div>
    </section>
  )
}
