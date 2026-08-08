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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeBrand }}
    >
      {children}
    </motion.div>
  )
}
