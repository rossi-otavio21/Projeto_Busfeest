'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity } from '@fortawesome/free-solid-svg-icons'
import { WhatsappGlyph } from '@/components/brand/icons'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { whatsappLink } from '@/lib/site'
import { rotasBase, rotasDestinos } from './rotas-data'

// MapLibre depende de APIs do navegador — carrega só no cliente, com um
// placeholder da mesma altura para não haver salto de layout.
const RotasFlightMap = dynamic(
  () => import('./rotas-flight-map').then((mod) => mod.RotasFlightMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-full animate-pulse rounded-2xl border border-white/10 bg-navy-deep md:h-[460px]" />
    ),
  },
)

const headerStagger = staggerContainer(0.09, 0.1)
const cardsStagger = staggerContainer(0.08)

export function RotasMap() {
  const whatsapp = whatsappLink(
    'Olá! Gostaria de saber sobre as rotas atendidas pela Busfeest.',
  )
  const headerReveal = useReveal(headerStagger)
  const mapReveal = useReveal(fadeUp)
  const cardsReveal = useReveal(cardsStagger)
  const ctaReveal = useReveal(fadeUp)

  return (
    <>
      {/* Abertura escura: a rede de rotas é o momento de assinatura da página */}
      <section className="bg-navy pb-16 pt-32 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <motion.div {...headerReveal} className="max-w-2xl">
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
            >
              <span className="h-1.5 w-6 rounded-full bg-blue" />
              <span>De onde partimos, para onde vamos</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl"
            >
              Conectando o sul de Minas <span className="editorial-accent text-blue">e além</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg font-light leading-relaxed text-gray"
            >
              Da base em Alfenas, chegamos aos principais destinos e polos da
              região — e montamos rotas sob medida para o seu grupo.
            </motion.p>
          </motion.div>

          {/* Rede de rotas em mapa vetorial dark */}
          <motion.div {...mapReveal} className="mt-12">
            <RotasFlightMap />
          </motion.div>
        </div>
      </section>

      {/* Seção clara: destinos e fechamento — mesma alternância de fundo já
          usada na galeria de Viagens, pra fotos e cards ganharem contraste
          e a página não ficar inteira em navy. */}
      <section className="border-t border-navy/10 bg-muted pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          {/* Rotas mais pedidas — cards com orçamento direto no WhatsApp */}
          <motion.div {...cardsReveal}>
            <motion.p
              variants={fadeUp}
              className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
            >
              <span className="h-1.5 w-6 rounded-full bg-blue" />
              Rotas mais pedidas
            </motion.p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rotasDestinos.map((destino) => (
                <motion.a
                  key={destino.name}
                  variants={fadeUp}
                  href={whatsappLink(
                    `Olá! Quero um orçamento da rota ${rotasBase.name} → ${destino.name} com a Busfeest.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Orçar a rota ${rotasBase.name} para ${destino.name} pelo WhatsApp`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue/40 hover:shadow-[0_16px_40px_-16px_rgba(54,149,197,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  {/* Foto do destino — enquanto não houver, um grafismo da marca
                      ocupa o mesmo espaço (o card não muda de altura depois). */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {destino.photo ? (
                      <Image
                        src={destino.photo.src}
                        alt={destino.photo.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ objectPosition: destino.photo.position }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center bg-muted"
                      >
                        <FontAwesomeIcon icon={faCity} className="h-9 w-9 text-navy/15" />
                      </div>
                    )}

                    {/* Escurece o pé da imagem para os selos e o texto respirarem */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent"
                    />

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy/85 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {destino.uf}
                    </span>
                    <WhatsappGlyph className="absolute right-3 top-3 h-6 w-6 opacity-70 drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                  </div>

                  <div className="p-5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {rotasBase.name}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-muted-foreground/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue"
                        aria-hidden="true"
                      />
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-navy transition-colors group-hover:text-blue">
                      {destino.name}
                    </p>
                    <span className="mt-3 inline-block rounded-full border border-navy/10 px-2.5 py-1 text-[0.7rem] font-semibold text-muted-foreground">
                      ≈ {destino.km} km
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Fechamento: rota sob medida + CTA verde-WhatsApp */}
          <motion.div
            {...ctaReveal}
            className="mt-16 flex flex-col items-start gap-6 border-t border-navy/10 pt-10 md:flex-row md:items-center md:justify-between"
          >
            <p className="max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
              Seu destino não está no mapa? Também fazemos conexão com aeroportos
              regionais e montamos <strong className="font-semibold text-navy">rotas sob medida</strong> para o seu grupo.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold uppercase tracking-wider text-navy-deep shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(37,211,102,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              <WhatsappGlyph className="h-6 w-6" />
              Falar no WhatsApp
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
