'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeIn, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

/**
 * Foto real (grupo de estudantes + van da Busfeest no Unigames 2026), não um
 * ícone ou parágrafo — recortada por `object-position` para mostrar só a
 * faixa fotográfica limpa do post original (sem o texto/selo do flyer).
 */
export function FretamentoPhotoBand() {
  const reveal = useReveal(fadeIn)

  return (
    <motion.div {...reveal} className="relative h-[60vh] max-h-[520px] overflow-hidden bg-navy">
      <Image
        src={media.eventPhoto}
        alt="Grupo de estudantes reais ao lado de uma van da Busfeest antes de uma viagem para o Unigames 2026"
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '50% 58%' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent"
      />
      <p className="absolute inset-x-0 bottom-6 px-4 text-center text-sm font-medium text-white/90 md:px-6">
        Grupo real transportado pela Busfeest — Unigames 2026
      </p>
    </motion.div>
  )
}
