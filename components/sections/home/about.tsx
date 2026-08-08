'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronMark, RoadDivider } from '@/components/brand/chevron'
import { usePrefersReducedMotion } from '@/lib/motion'
import { media } from '@/lib/media'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = usePrefersReducedMotion()

  // Progresso contínuo do tempo em que o Sobre está na tela — do primeiro
  // enquadramento até sair de vista. É essa mesma variável que dirige a
  // entrada (foto/painel) e o parallax, para que tudo se mova em uníssono
  // em vez de disparar em timers isolados (evita "Hero termina → fade →
  // Sobre aparece").
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // A foto entra no exato estado em que o Hero terminou de encolher (escala
  // 0.86, raio 32px — ver hero.tsx) e se abre até o repouso: a "janela" do
  // Hero se transforma na paisagem do Sobre, em vez de uma seção nova
  // aparecendo do nada.
  const photoScale = useTransform(scrollYProgress, [0, 0.4], reduceMotion ? [1, 1] : [0.86, 1])
  const photoRadius = useTransform(scrollYProgress, [0, 0.4], reduceMotion ? [0, 0] : [32, 0])

  // Parallax contínuo durante toda a passagem pela seção — a paisagem
  // observada "em movimento" enquanto se rola, como olhar pela janela.
  const photoParallax = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-48, 48])

  // Painel de texto: física acoplada à mesma janela de tempo da foto.
  const panelOpacity = useTransform(scrollYProgress, [0.08, 0.42], reduceMotion ? [1, 1] : [0, 1])
  const panelY = useTransform(scrollYProgress, [0, 0.4], reduceMotion ? [0, 0] : [56, 0])

  // A estrada resolve depois que o resto já assentou — retoma o traço
  // deixado no fim do Hero (mesmo grafismo `road-dashes`).
  const dividerScale = useTransform(scrollYProgress, [0.45, 0.75], reduceMotion ? [1, 1] : [0, 1])

  return (
    <section ref={sectionRef} id="sobre" className="relative bg-white">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-2">
        {/* Foto sangrando até a borda — sem moldura fixa: a moldura é o próprio
            eco do encolhimento do Hero, que se abre conforme se rola. */}
        <motion.div
          style={{ scale: photoScale, borderRadius: photoRadius }}
          className="relative h-[60svh] overflow-hidden md:h-auto"
        >
          <motion.div style={{ y: photoParallax }} className="absolute inset-0">
            <Image
              src={media.aboutPhoto}
              alt="Grupo de passageiros embarcando animados em um ônibus da Busfeest para uma excursão"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="scale-110 object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Painel de texto sobrepõe fisicamente a foto — página de revista, não coluna contida.
            w-full (em vez de max-w intrínseco) evita sobra de espaço vazio em telas largas. */}
        <div className="relative flex items-center px-4 md:px-0 md:pr-10">
          <motion.div
            style={{ opacity: panelOpacity, y: panelY }}
            className="relative z-10 -mt-14 w-full bg-white p-8 shadow-[0_30px_60px_-25px_rgba(18,43,66,0.35)] md:-ml-20 md:mt-0 md:p-14"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue">
              <span className="relative h-px w-8 bg-blue/40">
                <span className="absolute -left-0.5 -top-[3px] h-[7px] w-[7px] rounded-full bg-blue" />
              </span>
              Sobre a Busfeest
            </div>
            <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.05] tracking-tight text-navy md:text-5xl">
              Quase 6 anos rodando o sul de Minas
            </h2>

            <div className="mt-8 flex items-start gap-6">
              <div className="shrink-0">
                <div className="text-6xl font-extrabold leading-none text-blue md:text-7xl">+6</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy">
                  anos de estrada
                </div>
              </div>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                A Busfeest nasceu para tornar a viagem em grupo acessível: um
                transporte low cost pensado para quem não quer pagar caro, mas
                também não abre mão de chegar bem e com segurança.
              </p>
            </div>

            <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground">
              Expandimos nossa atuação por todo o sul de Minas Gerais, atendendo
              turmas de faculdade, atléticas, igrejas, empresas e famílias em
              excursões, eventos e translados.
            </p>

            <motion.div
              style={{ scaleX: dividerScale, transformOrigin: 'left' }}
              className="mt-8 max-w-24"
            >
              <RoadDivider />
            </motion.div>

            <Link
              href="/sobre"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              Conheça a Busfeest
              <ChevronMark className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
