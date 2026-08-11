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

  // Progresso contínuo de scroll para sincronizar fotografia e tipografia
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Transição contínua da moldura e escala da foto (sem sobressaltos)
  const photoScale = useTransform(scrollYProgress, [0, 0.4], reduceMotion ? [1, 1] : [0.92, 1])
  const photoParallax = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-36, 36])

  // Revelação fluida do bloco textual editorial
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.38], reduceMotion ? [1, 1] : [0, 1])
  const textY = useTransform(scrollYProgress, [0.08, 0.38], reduceMotion ? [0, 0] : [40, 0])

  // Linha de estrada resolvida no tempo
  const dividerScale = useTransform(scrollYProgress, [0.4, 0.7], reduceMotion ? [1, 1] : [0, 1])

  return (
    <section ref={sectionRef} id="sobre" className="relative bg-white py-20 md:py-32 overflow-hidden">
      {/* Marcador de Trajeto Editorial */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 mb-10">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue">
          <span className="h-1.5 w-6 rounded-full bg-blue" />
          <span>02 · A NOSSA HISTÓRIA & CONEXÃO</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-12 md:items-center md:gap-16 md:px-8">
        {/* Enquadramento fotográfico autêntico — sem caixas de sombra artificiais */}
        <motion.div
          style={{ scale: photoScale }}
          className="relative min-h-[420px] md:min-h-[580px] md:col-span-6 overflow-hidden rounded-2xl md:rounded-3xl bg-navy/5 shadow-2xl"
        >
          <motion.div style={{ y: photoParallax }} className="absolute inset-0 h-[115%] -top-[7.5%]">
            <Image
              src={media.aboutPhoto}
              alt="Grupo de passageiros reais embarcando animados em um ônibus da Busfeest para uma excursão"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center brightness-100 contrast-[1.02]"
            />
          </motion.div>
          
          {/* Legenda de foto estilo revista */}
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-navy/85 backdrop-blur-md p-4 text-white">
            <p className="text-xs font-medium tracking-wide">
              Embarque real de grupo com a Busfeest — Sul de Minas Gerais
            </p>
          </div>
        </motion.div>

        {/* Narrativa Editorial de Texto (Sem Card Flutuante) */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="flex flex-col justify-center md:col-span-6"
        >
          <h2 className="text-balance text-3xl font-extrabold leading-[1.02] tracking-tight text-navy sm:text-5xl md:text-6xl">
            Quase <span className="editorial-accent text-blue">6 anos</span> unindo pessoas e destinos no Sul de Minas.
          </h2>

          <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              A <strong className="font-semibold text-navy">Busfeest</strong> nasceu para tornar a viagem em grupo acessível e segura: um transporte low cost de verdade, pensado para quem quer economizar sem abrir mão do conforto e do profissionalismo.
            </p>
            <p>
              Com base em Alfenas, atendemos turmas universitárias, atléticas, empresas, igrejas e famílias em excursões, passeios e translados por toda a região.
            </p>
          </div>

          <motion.div
            style={{ scaleX: dividerScale, transformOrigin: 'left' }}
            className="mt-8 max-w-32"
          >
            <RoadDivider />
          </motion.div>

          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/sobre"
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-navy hover:text-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              Conheça a história completa
              <ChevronMark className="h-4 w-4 text-blue transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

