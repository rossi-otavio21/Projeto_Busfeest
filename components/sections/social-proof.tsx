'use client'

import { motion } from 'framer-motion'
import { InstagramGlyph } from '@/components/brand/icons'
import { ChevronMark } from '@/components/brand/chevron'
import { MotionButton, ctaTapSpring, fadeUp, slideFromRight, staggerContainer, useReveal } from '@/lib/motion'
import { site } from '@/lib/site'

// Segmentos e ocasiões que a Busfeest já atendeu (prova social real).
const audiences = [
  'Atléticas e turmas de faculdade',
  'Igrejas e grupos religiosos',
  'Empresas e eventos corporativos',
  'Famílias e excursões',
]

const listStagger = staggerContainer(0.08)

export function SocialProof() {
  const textReveal = useReveal(fadeUp)
  const listReveal = useReveal(listStagger)

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <motion.div {...textReveal}>
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

            <MotionButton
              variant="cta-dark"
              size="cta-md"
              className="mt-8"
              nativeButton={false}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={ctaTapSpring}
              render={
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <InstagramGlyph />
              Ver eventos no {site.instagram.handle}
            </MotionButton>
          </motion.div>

          <motion.ul {...listReveal} className="grid gap-3">
            {audiences.map((audience) => (
              <motion.li
                key={audience}
                variants={slideFromRight}
                className="flex items-center gap-4 rounded-xl bg-white px-5 py-4"
              >
                <ChevronMark className="h-4 w-4 shrink-0 text-blue" />
                <span className="font-medium text-navy">{audience}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
