'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { InstagramGlyph } from '@/components/brand/icons'
import { staggerContainer, tileReveal, useReveal } from '@/lib/motion'
import { galleryCategories, galleryItems, type GalleryCategory, type GalleryItem } from '@/lib/gallery'
import { cn } from '@/lib/utils'

const ALL = 'Todas' as const
const filters: Array<'Todas' | GalleryCategory> = [ALL, ...galleryCategories]

const sizeClasses: Record<GalleryItem['size'], string> = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  lg: 'col-span-2 row-span-2',
  pano: 'col-span-2 row-span-1 sm:col-span-3 lg:col-span-4',
}

const gridStagger = staggerContainer(0.05)

export function ViagensGallery() {
  const [active, setActive] = useState<'Todas' | GalleryCategory>(ALL)
  const gridReveal = useReveal(gridStagger)
  const filteredItems =
    active === ALL ? galleryItems : galleryItems.filter((item) => item.category === active)

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Galeria
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Um retrato das viagens que já rodamos
          </h2>
          <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">
            Estamos organizando o álbum com fotos reais de cada excursão, festa e
            evento. O espaço já está reservado — as fotos chegam em breve.
          </p>
        </div>

        {/* Filtro por categoria — indicador com layoutId desliza entre as pills */}
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar galeria por categoria">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              aria-pressed={active === filter}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue',
                active === filter ? 'text-white' : 'text-navy hover:text-blue',
              )}
            >
              {active === filter && (
                <motion.span
                  layoutId="gallery-active-pill"
                  className="absolute inset-0 rounded-full bg-blue"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative">{filter}</span>
            </button>
          ))}
        </div>

        <motion.div
          {...gridReveal}
          className="mt-8 grid auto-rows-[130px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[150px] sm:grid-cols-3 lg:auto-rows-[170px] lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={tileReveal}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn('relative overflow-hidden', sizeClasses[item.size])}
              >
                {item.src ? (
                  <>
                    <Image
                      src={item.src}
                      alt={item.alt ?? item.category}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className={item.isPost ? 'bg-navy object-contain' : 'object-cover'}
                    />
                    {/* Posts reais do Instagram mostram o quadro inteiro (não recortado) e
                        ganham um selo — deixa claro que é conteúdo real de rede social,
                        não fotografia de banco disfarçada de foto de viagem. */}
                    {item.isPost && (
                      <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                        <InstagramGlyph className="h-3 w-3" />
                        Post real
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-gray bg-white px-3 text-center">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-blue-deep">
                      {item.category}
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                      Foto em breve
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
