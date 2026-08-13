'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import { InstagramGlyph } from '@/components/brand/icons'
import { Letreiro } from '@/components/brand/letreiro'
import { GalleryLightbox } from './gallery-lightbox'
import { easeBrand, fadeUp, staggerContainer, useReveal, viewportOnce } from '@/lib/motion'
import { galleryCategories, galleryItems, type GalleryCategory } from '@/lib/gallery'
import { cn } from '@/lib/utils'

const ALL = 'Todas' as const
type Filter = typeof ALL | GalleryCategory

/** Contagem por filtro — estática, calculada uma vez no módulo. */
const filters: Array<{ label: Filter; count: number }> = [
  { label: ALL, count: galleryItems.length },
  ...galleryCategories.map((category) => ({
    label: category,
    count: galleryItems.filter((item) => item.category === category).length,
  })),
]

/**
 * Entrada dos tiles. O atraso vem da posição na linha visual (`index % 4`),
 * não do índice absoluto: com 24 fotos, um stagger corrido acumularia mais
 * de um segundo de espera na última. Assim a onda é sempre curta,
 * independente do tamanho do acervo.
 */
const tileRevealStaggered: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeBrand, delay: (index % 4) * 0.05 },
  }),
}

const headerStagger = staggerContainer(0.08)

export function ViagensGallery() {
  const [active, setActive] = useState<Filter>(ALL)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headerReveal = useReveal(headerStagger)

  const filteredItems =
    active === ALL ? galleryItems : galleryItems.filter((item) => item.category === active)

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...headerReveal} className="max-w-2xl">
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
          >
            <span className="h-1.5 w-6 rounded-full bg-blue" />
            <span>Galeria</span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl"
          >
            O arquivo de quem já <span className="editorial-accent text-blue">viajou</span> com a
            gente
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg font-light leading-relaxed text-muted-foreground"
          >
            Nada de banco de imagens. São {galleryItems.length} registros das nossas próprias
            viagens — do ponto de encontro de manhã cedo à volta de madrugada. Cada foto leva o
            letreiro do dia, como no painel do ônibus.
          </motion.p>
        </motion.div>

        {/* Filtro por categoria — indicador com layoutId desliza entre as pills */}
        <div
          className="mt-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar galeria por categoria"
        >
          {filters.map(({ label, count }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              aria-pressed={active === label}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
                active === label ? 'text-white' : 'text-navy hover:text-blue',
              )}
            >
              {active === label && (
                <motion.span
                  layoutId="gallery-active-pill"
                  className="absolute inset-0 rounded-full bg-blue"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative">
                {label}
                <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-light text-muted-foreground">
          Cada foto abre em tela cheia.
        </p>

        {/*
          Masonry em colunas CSS: cada foto entra com a proporção real do
          arquivo, sem recorte. A leva veio de celular — 9:16 na maioria — e
          a grade anterior, de linhas fixas, espremia esses retratos em
          quadrados e faixas horizontais. Aqui a coluna se adapta à foto, e
          não o contrário.
        */}
        <ul className="mt-6 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {filteredItems.map((item, index) => (
            <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
              <motion.button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`${item.sign} — ver foto em tela cheia`}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={tileRevealStaggered}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-xl bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent"
                />

                {/* Posts do Instagram são arte pronta, não fotografia solta —
                    o selo deixa a diferença explícita. */}
                {item.isPost && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-navy-deep/85 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-wider text-gray backdrop-blur-sm">
                    <InstagramGlyph className="h-2.5 w-2.5" />
                    Post
                  </span>
                )}

                <span className="absolute inset-x-2 bottom-2 flex opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  <Letreiro>{item.sign}</Letreiro>
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      <GalleryLightbox
        items={filteredItems}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}
