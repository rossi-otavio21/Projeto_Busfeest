'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { InstagramGlyph } from '@/components/brand/icons'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { easeBrand, slideFromLeft, slideFromRight, useReveal, usePrefersReducedMotion } from '@/lib/motion'
import { media } from '@/lib/media'

interface ServiceImage {
  src: string
  alt: string
  /** Post real do Instagram (tem texto/selo no próprio arquivo) — mostrado
   * inteiro via object-contain + selo, nunca recortado como foto comum. */
  isPost?: boolean
  /** object-position custom — usado quando o recorte central padrão não é
   * suficiente para remover uma faixa de texto fina na origem da foto. */
  position?: string
  /** Zoom extra (ex. 1.25) quando o contêiner não sobra espaço de recorte
   * suficiente com object-position sozinho — amplia em torno do mesmo ponto. */
  zoom?: number
}

interface FretamentoService {
  id: string
  number: string
  title: string
  description: string
  ctaMessage: string
  images: ServiceImage[]
  featured?: boolean
}

const services: FretamentoService[] = [
  {
    id: 'grupos-atleticas',
    number: '01',
    title: 'Fretamento para Grupos & Atléticas',
    description:
      'Atléticas universitárias, igrejas, empresas e famílias. Fretamento sob medida para o tamanho e a rota do seu grupo — o coração do que fazemos.',
    ctaMessage: 'Olá! Quero solicitar um orçamento de fretamento para grupos/atléticas.',
    featured: true,
    images: [
      {
        src: media.posts.treme,
        alt: 'Estudantes embarcando em ônibus da Busfeest para viagem em grupo',
      },
      {
        src: media.posts.unigamesTrofeu,
        alt: 'Post do Instagram da Busfeest: atlética Muquirana comemorando com troféu no Unigames 2026',
        isPost: true,
      },
    
    ],
  },
  {
    id: 'turismo-excursoes',
    number: '02',
    title: 'Turismo Regional & Excursões',
    description:
      'Roteiros pelo sul de Minas e destinos próximos: circuitos, cachoeiras, eventos e passeios em grupo.',
    ctaMessage: 'Olá! Quero um orçamento de fretamento para turismo regional/excursão.',
    images: [
      {
        src: media.viagens.embarqueAvenida,
        alt: 'Ônibus de turismo da Busfeest percorrendo estradas no sul de Minas Gerais',
      },
      {
        src: media.corporativo.equipeScMinasGrupo2,
        alt: 'Ônibus reais contratados pela Busfeest para a rota Alfenas × Juiz de Fora',
        // Foto original tem uma legenda no topo. O contêiner é quase
        // quadrado (pouca margem de recorte vertical), então só
        // object-position não basta — soma um zoom leve, ampliado em torno
        // do mesmo ponto, para empurrar a legenda inteira para fora do quadro.
        position: '50% 100%',
        zoom: 1.3,
      },
      {
        src: media.posts.experiencias,
        alt: 'Post do Instagram da Busfeest: van em viagem noturna para o destino Secret Hut',
        isPost: true,
      },
      // Sequência: estrada → ônibus real → chegada ao destino.
      // FOTO FUTURA IDEAL: paisagem/destino turístico do sul de Minas com o
      // ônibus em primeiro plano, horário dourado — ainda não existe no
      // projeto, não inventar.
    ],
  },
  {
    id: 'translado-aeroportos',
    number: '03',
    title: 'Translado de Aeroportos & Conexões',
    description: 'Horários combinados e pontualidade nos principais aeroportos da região.',
    ctaMessage: 'Olá! Quero um orçamento de translado de aeroporto com a Busfeest.',
    images: [
      {
        src: media.aboutPhoto,
        alt: 'Passageiros embarcando no ônibus da Busfeest para uma viagem',
      },
      // Só há 1 foto real coerente com esta modalidade hoje — sem foto de
      // aeroporto/bagagem real ainda. NÃO inventar placeholder.
      // FOTO FUTURA IDEAL: passageiros com bagagem embarcando/desembarcando
      // em translado de aeroporto, horizontal 16:9, luz natural.
    ],
  },
]

/** Carrossel de imagens da área fotográfica de UM serviço — não afeta título/texto/CTA. */
function ServiceCarousel({ images }: { images: ServiceImage[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = usePrefersReducedMotion()
  const touchStartX = useRef<number | null>(null)
  const single = images.length <= 1

  useEffect(() => {
    if (single || reduceMotion || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [single, reduceMotion, paused, images.length])

  const go = (next: number) => setIndex(((next % images.length) + images.length) % images.length)

  const current = images[index]

  return (
    <div
      // `touch-pan-y` avisa o navegador pra só interpretar gestos verticais
      // nativamente aqui — sem isso, o arrasto horizontal do carrossel é
      // capturado pelo gesto de navegação/overscroll do próprio navegador
      // mobile, que empurra a página inteira (inclusive o header fixo) pro
      // lado por um instante. Só acontece nesta seção porque é a única com
      // swipe por toque no site.
      className="relative h-[280px] w-full touch-pan-y overflow-hidden rounded-2xl bg-navy shadow-xl sm:h-[360px] md:h-[440px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || single) return
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current
        if (Math.abs(delta) > 40) go(delta < 0 ? index + 1 : index - 1)
        touchStartX.current = null
      }}
    >
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: easeBrand }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={current.isPost ? 'bg-navy object-contain' : 'object-cover'}
            style={{
              objectPosition: current.position,
              transform: current.zoom ? `scale(${current.zoom})` : undefined,
              transformOrigin: current.zoom ? current.position ?? '50% 50%' : undefined,
            }}
          />
          {current.isPost && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <InstagramGlyph className="h-3 w-3" />
              Post real
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {!single && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Ver foto ${i + 1} de ${images.length}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FretamentoServices() {
  const revealLeft = useReveal(slideFromLeft)
  const revealRight = useReveal(slideFromRight)

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-16 md:px-8 md:pt-20">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue">
          <span className="h-1.5 w-6 rounded-full bg-blue" />
          <span>Modalidades de fretamento</span>
        </div>
        <h2 className="mt-4 max-w-2xl text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
          Soluções completas de transporte rodoviário
        </h2>
      </div>

      {services.map((service, index) => {
        const flipped = index % 2 === 1
        const reveal = flipped ? revealRight : revealLeft
        return (
          <motion.article
            key={service.id}
            {...reveal}
            className={`border-b border-border py-16 md:py-20 ${
              service.featured ? 'bg-navy text-white' : 'bg-white text-navy'
            }`}
          >
            <div
              className={`mx-auto flex max-w-7xl flex-col gap-8 px-6 md:px-8 ${
                flipped ? 'md:flex-row-reverse' : 'md:flex-row'
              } md:items-center`}
            >
              <div className="md:w-1/2">
                <ServiceCarousel images={service.images} />
              </div>

              <div className="md:w-1/2">
                <h3
                  className={`text-balance font-extrabold leading-[1.05] tracking-tight ${
                    service.featured ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl'
                  }`}
                >
                  <span className="text-blue">{service.number}</span>
                  {' · '}
                  {service.title}
                </h3>
                <p
                  className={`mt-4 max-w-md text-pretty font-light leading-relaxed ${
                    service.featured ? 'text-lg text-gray' : 'text-base text-muted-foreground'
                  }`}
                >
                  {service.description}
                </p>

                <div className="mt-6">
                  <WhatsappCta
                    message={service.ctaMessage}
                    variant={service.featured ? 'cta' : 'cta-outline-dark'}
                    size="cta-md"
                  >
                    Orçar esta modalidade
                    <ChevronMark className="h-4 w-4" />
                  </WhatsappCta>
                </div>
              </div>
            </div>
          </motion.article>
        )
      })}
    </section>
  )
}
