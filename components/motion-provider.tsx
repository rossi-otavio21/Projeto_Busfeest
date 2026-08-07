'use client'

import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

/**
 * Aplica `prefers-reduced-motion` a todo o site pelo motor de animação do
 * Framer Motion (não por condicional no JSX): a detecção do SO só acontece
 * depois da hidratação, então isso não causa divergência entre o HTML do
 * servidor e o do cliente.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
