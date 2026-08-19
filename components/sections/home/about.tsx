'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronMark, RoadDivider } from '@/components/brand/chevron'
import { useIsMobileViewport, usePrefersReducedMotion } from '@/lib/motion'
import { media } from '@/lib/media'

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = usePrefersReducedMotion()
  const isMobile = useIsMobileViewport()
  // No mobile, 5 `useTransform` ligados ao scroll recalculando junto com um
  // backdrop-blur dentro do contêiner que escala eram pesados demais — a
  // legenda com blur força repaint a cada frame enquanto a foto anima scale
  // por baixo dela. Desktop mantém a coreografia completa.
  //
  // Os ramos "sem animação" abaixo precisam trazer o valor de repouso
  // explícito (`{ opacity: 1 }`, `{ scale: 1 }`...), nunca `undefined`.
  // `isMobile` só vira true depois da hidratação: no primeiro render o
  // componente ainda se acha desktop e o Framer escreve `opacity: 0` no
  // style inline. Trocar o style para `undefined` depois não apaga o que
  // já foi escrito — e o bloco de texto inteiro ficava invisível no
  // celular, que era exatamente o caso desta seção.
  const heavyMotion = !reduceMotion && !isMobile

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
          style={heavyMotion ? { scale: photoScale } : { scale: 1 }}
          className="relative min-h-[420px] md:min-h-[580px] md:col-span-6 overflow-hidden rounded-2xl md:rounded-3xl bg-navy/5 shadow-2xl"
        >
          <motion.div
            style={heavyMotion ? { y: photoParallax } : { y: 0 }}
            className="absolute inset-0 h-[115%] -top-[7.5%]"
          >
            <Image
              src={media.aboutPhoto}
              alt="Ônibus azul da Busfeest encostado na calçada com o letreiro escrito Boa viagem, enquanto os passageiros embarcam"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover brightness-100 contrast-[1.02]"
              style={{ objectPosition: '55% 50%' }}
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
          style={heavyMotion ? { opacity: textOpacity, y: textY } : { opacity: 1, y: 0 }}
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
              Da base em Alfenas já saímos para 22 cidades — e no mesmo mês a operação vai de uma excursão de fim de semana a seis ônibus na rua para um evento só.
            </p>
          </div>

          <motion.div
            style={heavyMotion ? { scaleX: dividerScale, transformOrigin: 'left' } : { scaleX: 1, transformOrigin: 'left' }}
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

