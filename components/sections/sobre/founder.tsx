'use client'

import { motion } from 'framer-motion'
import { ProfileCard } from '@/components/ui/profile-card'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'
import { site, whatsappLink } from '@/lib/site'

// TODO: nome, cargo, descrição e foto são placeholder — trocar por texto e
// foto reais do fundador (ver lib/media.ts para a foto).
const FOUNDER_NAME = 'Matheus Souza'
const FOUNDER_TITLE = 'Fundador · Busfeest'
const FOUNDER_DESCRIPTION =
  'Matheus fundou a Busfeest para provar que dá pra viajar em grupo com preço justo sem abrir mão de segurança e pontualidade. Hoje, quase 6 anos depois, ele segue à frente da operação em Alfenas-MG, cuidando de cada rota como se fosse a própria turma viajando.'

export function Founder() {
  const headerReveal = useReveal(fadeUp)
  const cardReveal = useReveal(staggerContainer(0.05, 0.1))

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...headerReveal} className="mb-12 max-w-2xl md:mb-16">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-ink">
            <span className="h-1.5 w-6 rounded-full bg-blue" />
            <span>Quem toca a Busfeest</span>
          </div>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Uma pessoa por trás de cada viagem
          </h2>
        </motion.div>

        <motion.div {...cardReveal}>
          <ProfileCard
            name={FOUNDER_NAME}
            title={FOUNDER_TITLE}
            description={FOUNDER_DESCRIPTION}
            imageUrl={media.photoInstagram}
            instagramUrl={site.boss.url}
            whatsappUrl={whatsappLink('Olá! Vim pelo site da Busfeest e queria falar com você.')}
          />
        </motion.div>
      </div>
    </section>
  )
}
