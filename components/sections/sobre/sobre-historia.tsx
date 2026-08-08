'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeUp, slideFromLeft, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

const headerStagger = staggerContainer(0.09, 0.1)

export function SobreHistoria() {
  const headerReveal = useReveal(headerStagger)
  const photoReveal = useReveal(slideFromLeft)

  return (
    <>
      <section className="bg-navy pb-16 pt-32 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div {...headerReveal} className="max-w-3xl">
            <motion.span
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-blue"
            >
              Sobre a Busfeest
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
            >
              Quase 6 anos rodando o sul de Minas.
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[1fr_1fr] md:gap-16 md:px-6">
          <div className="text-pretty text-xl font-light leading-relaxed text-navy md:text-2xl">
            <p>
              <span className="text-6xl font-extrabold text-blue">A</span>{' '}
              Busfeest nasceu para tornar a viagem em grupo acessível: um
              transporte low cost pensado para quem não quer pagar caro, mas
              também não abre mão de chegar bem e com segurança.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              De lá pra cá, expandimos nossa atuação por todo o sul de Minas
              Gerais — hoje atendemos turmas de faculdade, atléticas, igrejas,
              empresas e famílias em excursões, competições universitárias,
              eventos e translados, sempre com o mesmo motorista de sempre e o
              mesmo cuidado com cada grupo.
            </p>
          </div>

          <motion.div {...photoReveal} className="relative h-72 overflow-hidden md:h-auto">
            <Image
              src={media.aboutPhoto}
              alt="Grupo de passageiros embarcando animados em um ônibus da Busfeest para uma excursão"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
