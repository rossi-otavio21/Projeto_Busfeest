'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { easeBrand } from '@/lib/motion'

// `template.tsx` remonta a cada navegação (diferente de `layout.tsx`, que
// persiste) — dá uma entrada sutil por página sem precisar de
// AnimatePresence amarrado ao pathname. Só entrada, sem saída: o pedido foi
// "pequenas transições", não uma animação grande a cada troca de rota.
// Passa por `MotionConfig[reducedMotion="user"]` (motion-provider.tsx) como
// qualquer outra animação por `animate` — reduced motion já é respeitado.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      // Começa em 0.4, não em 0: com `opacity: 0` a página inteira sumia por
      // ~300ms a cada navegação — lido como "os componentes desapareceram",
      // e não como transição. Meia opacidade dá a mesma sensação de entrada
      // sem que exista um quadro em que não há conteúdo na tela.
      initial={{ opacity: 0.4, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeBrand }}
    >
      {children}
    </motion.div>
  )
}
