'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
import { totalCidadesAtendidas } from '@/components/sections/rotas/rotas-data'

const heroStagger = staggerContainer(0.09, 0.12)

export function Hero() {
  const reduceMotion = usePrefersReducedMotion()
  const isMobile = useIsMobileViewport()
  // Zoom Ken Burns do fundo: contínuo, não ligado ao scroll. Sai no mobile
  // (aparelhos mais fracos sentiam o repaint) e sob movimento reduzido.
  const kenBurns = !reduceMotion && !isMobile

  return (
    // O Hero ocupa uma tela e entrega a página para a próxima seção.
    //
    // Havia aqui um wrapper de 175svh: o quadro ficava preso no topo e
    // encolhia (scale + borderRadius animados) enquanto se rolava a sobra.
    // O efeito custava ~75vh de rolagem antes de qualquer conteúdo novo
    // aparecer e foi rejeitado na revisão — junto com a headline que
    // falava em "scroll". Não voltar sem pedido explícito.
    <section id="top" className="relative h-svh bg-navy">
      <div className="relative isolate flex h-full w-full flex-col justify-between overflow-hidden bg-navy">
        {/* Fotografia real da BUSFEEST: com tratamento sutil para valorizar o ônibus real e as montanhas de Minas */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={kenBurns ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        >
          {/* Recorte puxado para a direita do quadro: enquadra a igreja, as
              palmeiras e a turma, e empurra o letreiro gigante da cidade
              para debaixo do gradiente, onde ele não disputa leitura com a
              headline branca. */}
          <Image
            src={media.heroBackground}
            alt="Turma inteira de uma excursão da Busfeest reunida na praça da cidade de destino, em dia de céu limpo"
            fill
            priority
            sizes="100vw"
            className="scale-[1.45] object-cover brightness-95 contrast-105"
            style={{ objectPosition: '86% 40%', transformOrigin: '86% 40%' }}
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
              Todo mundo na estrada.
              <br />
              <span className="editorial-accent text-blue">E no orçamento.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-pretty text-base font-light leading-relaxed text-gray sm:text-xl"
            >
              Quase 6 anos movendo gente pelo Sul de Minas: {totalCidadesAtendidas}{' '}
              cidades atendidas, da excursão de fim de semana à linha que roda
              todo dia útil.
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
                <span className="text-blue font-bold">{totalCidadesAtendidas}</span> Cidades Atendidas
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

        {/* Faixa de estrada no pé do quadro — antes era revelada conforme o
            scroll do wrapper alto; sem ele, é grafismo fixo. */}
        <div
          aria-hidden="true"
          className="road-dashes absolute inset-x-0 bottom-0 z-20 h-1.5 opacity-90"
        />
      </div>
    </section>
  )
}
