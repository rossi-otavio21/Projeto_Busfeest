'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeIn, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

/*
  FOTO REAL DO UNIGAMES 2026 (GRUPO DE ESTUDANTES + VAN BUSFEEST):
  - Transição sutil entre o Hero e o Catálogo de Fretamento
  - Enquadramento: Faixa panorâmica cinematográfica reduzida (30-40vh)
  - Tratamento: Cores naturais da marca BUSFEEST
*/
export function FretamentoPhotoBand() {
  const reveal = useReveal(fadeIn)

  return (
    <motion.div {...reveal} className="relative h-[34vh] max-h-[320px] min-h-[200px] overflow-hidden bg-navy">
      <Image
        src={media.eventPhoto}
        alt="Grupo de estudantes reais ao lado de uma van da Busfeest antes de uma viagem para o Unigames 2026"
        fill
        sizes="100vw"
        className="object-cover brightness-95 contrast-[1.02]"
        style={{ objectPosition: '50% 55%' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-navy/70"
      />
      <div className="absolute inset-x-0 bottom-4 mx-auto max-w-7xl px-6 md:px-8 flex justify-between items-end">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy/85 backdrop-blur-md px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          Fretamento Real · Unigames 2026
        </span>
      </div>
      <div aria-hidden="true" className="road-dashes absolute inset-x-0 bottom-0 h-1 opacity-70" />
    </motion.div>
  )
}


