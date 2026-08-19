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
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <motion.div {...headerReveal} className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
            >
              <span className="h-1.5 w-6 rounded-full bg-blue" />
              <span>Sobre a Busfeest</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
            >
              Quase 6 anos <span className="editorial-accent text-blue">rodando</span> o sul de Minas.
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_1fr] md:gap-16 md:px-8">
          <div className="text-pretty text-xl font-light leading-relaxed text-navy md:text-2xl">
            <p>
              <span className="text-6xl font-extrabold text-blue">A</span>{' '}
              Busfeest nasceu para tornar a viagem em grupo acessível: um
              transporte low cost pensado para quem não quer pagar caro, mas
              também não abre mão de chegar bem e com segurança.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              De lá pra cá, expandimos a atuação por todo o sul de Minas Gerais
              — e crescemos sem mudar o método: veículo vistoriado, motorista
              profissional, horário combinado antes e alguém da Busfeest
              acompanhando a operação do embarque ao retorno.
            </p>
          </div>

          <motion.div {...photoReveal} className="relative h-72 overflow-hidden rounded-2xl md:h-auto">
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
