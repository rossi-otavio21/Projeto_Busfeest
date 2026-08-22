'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeUp, slideFromLeft, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

const headerStagger = staggerContainer(0.09, 0.1)

/**
 * Marcos da operação. Todos com fonte: os posts da própria Busfeest
 * arquivados em /public/images/originais e a malha em rotas-data.ts.
 * Não acrescentar nada aqui sem material que comprove.
 */
const marcos = [
  { valor: '~6', label: 'anos de estrada' },
  { valor: '22', label: 'cidades atendidas' },
  { valor: '6', label: 'ônibus num evento' },
  { valor: '219', label: 'pessoas/dia no Treme' },
]

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
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-bright"
            >
              <span className="h-1.5 w-6 rounded-full bg-blue" />
              <span>Sobre a Busfeest</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
            >
              Quase 6 anos <span className="editorial-accent text-blue-bright">rodando</span> o sul de Minas.
            </motion.h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_1fr] md:gap-16 md:px-8">
          <div className="text-pretty text-xl font-light leading-relaxed text-navy md:text-2xl">
            <p>
              <span className="text-6xl font-extrabold text-blue-ink">A</span>{' '}
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
            <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
              Na prática isso é bem concreto. Na{' '}
              <strong className="font-semibold text-navy">Arapuca</strong>, em
              Lavras, foram 6 ônibus na rua para um evento só, com o ingresso
              saindo junto com a viagem. Para{' '}
              <strong className="font-semibold text-navy">
                São João del-Rei
              </strong>{' '}
              foram 5 excursões só em 2026. No{' '}
              <strong className="font-semibold text-navy">Treme</strong>, 14
              vans no transporte interno e mais 2 ônibus na rota Alfenas ×
              Pouso Alegre.
            </p>

            {/* Régua de números: o que o texto acima afirma, em formato de
                consulta rápida. Cada um sai de material publicado pela
                própria empresa — nenhum foi estimado. */}
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy/10 pt-8 sm:grid-cols-4">
              {marcos.map((marco) => (
                <div key={marco.label}>
                  <dt className="sr-only">{marco.label}</dt>
                  <dd className="text-3xl font-extrabold tracking-tight text-blue-ink md:text-4xl">
                    {marco.valor}
                  </dd>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {marco.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>

          <motion.div {...photoReveal} className="relative h-72 overflow-hidden rounded-2xl md:h-auto">
            <Image
              src={media.historiaPhoto}
              alt="Ônibus azul da Busfeest com o letreiro Turismo aceso, recebendo os passageiros na calçada"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: '58% 45%' }}
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
