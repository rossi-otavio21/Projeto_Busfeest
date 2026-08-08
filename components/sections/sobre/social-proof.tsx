'use client'

import { motion, type Variants } from 'framer-motion'
import { InstagramGlyph } from '@/components/brand/icons'
import { MotionButton, ctaTapSpring, fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { site } from '@/lib/site'

// Públicos atendidos pela Busfeest — tamanhos variados conforme o peso de
// cada segmento no negócio (não é lista, é mural).
const audiences = [
  { label: 'Atléticas', size: 'text-4xl md:text-5xl', tone: 'text-navy' },
  { label: 'Igrejas', size: 'text-2xl md:text-3xl', tone: 'text-blue-deep' },
  { label: 'Empresas', size: 'text-3xl md:text-4xl', tone: 'text-navy' },
  { label: 'Eventos', size: 'text-xl md:text-2xl', tone: 'text-blue-deep' },
  { label: 'Famílias', size: 'text-3xl md:text-4xl', tone: 'text-navy' },
]

const clusterStagger = staggerContainer(0.06)

const wordPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export function SocialProof() {
  const textReveal = useReveal(fadeUp)
  const clusterReveal = useReveal(clusterStagger)

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div {...textReveal} className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Quem já viajou com a gente
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Confiança de quem move grupos pelo sul de Minas
          </h2>
          <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">
            De excursões de atléticas a eventos de igrejas e empresas: já
            rodamos com todo tipo de grupo, construindo parcerias locais em
            cada cidade que atendemos.
          </p>
        </motion.div>

        <motion.div
          {...clusterReveal}
          className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-4"
        >
          {audiences.map((audience) => (
            <motion.span
              key={audience.label}
              variants={wordPop}
              className={`cursor-default font-extrabold tracking-tight transition-colors hover:text-blue ${audience.size} ${audience.tone}`}
            >
              {audience.label}
            </motion.span>
          ))}
        </motion.div>

        <MotionButton
          variant="cta-dark"
          size="cta-md"
          className="mt-12"
          nativeButton={false}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={ctaTapSpring}
          render={
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" />
          }
        >
          <InstagramGlyph />
          Ver eventos no {site.instagram.handle}
        </MotionButton>
      </div>
    </section>
  )
}
