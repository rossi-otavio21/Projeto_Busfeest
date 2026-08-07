'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
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
}

// Ciclo de gradientes só com os tons da paleta da marca (nada novo).
const tileGradients = [
  'bg-gradient-to-br from-navy to-navy-700',
  'bg-gradient-to-br from-blue to-blue-deep',
  'bg-gradient-to-br from-navy-700 to-navy-deep',
  'bg-gradient-to-br from-blue-deep to-navy',
]

const gridStagger = staggerContainer(0.05)

export function Gallery() {
  const [active, setActive] = useState<'Todas' | GalleryCategory>(ALL)
  const gridReveal = useReveal(gridStagger)
  const filteredItems =
    active === ALL ? galleryItems : galleryItems.filter((item) => item.category === active)

  return (
    <section id="galeria" className="bg-muted py-20 md:py-28">
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
            evento. Por enquanto, veja como as categorias vão se organizar aqui.
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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                variants={tileReveal}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  'group relative flex items-end overflow-hidden rounded-2xl',
                  sizeClasses[item.size],
                  tileGradients[index % tileGradients.length],
                )}
              >
                <Camera
                  className="absolute inset-0 m-auto h-8 w-8 text-white/25 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="relative z-10 m-3 inline-flex items-center gap-2 rounded-full bg-navy-deep/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <ChevronMark className="h-3 w-3 text-blue" />
                  {item.category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
