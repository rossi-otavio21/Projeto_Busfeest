import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'

/**
 * Tokens compartilhados de motion — a "mão" consistente por trás de
 * coreografias diferentes por seção (ver components/sections/*.tsx).
 */

export const easeBrand = [0.16, 1, 0.3, 1] as const

const revealTransition = { duration: 0.6, ease: easeBrand }

export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: revealTransition },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: revealTransition },
}

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: revealTransition },
}

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: revealTransition },
}

export const iconPop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 },
  },
}

export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: easeBrand } },
}

/** Viewport padrão para reveals de scroll: dispara uma vez, um pouco antes de entrar. */
export const viewportOnce = { once: true, margin: '-10% 0px' } as const

/** Spring de toque para CTAs — usado por `MotionButton`. */
export const ctaTapSpring = { type: 'spring', stiffness: 400, damping: 25 } as const

/**
 * Props padrão para revelar um elemento ao entrar na viewport.
 *
 * Não faz a checagem de `prefers-reduced-motion` aqui: isso é responsabilidade
 * do `<MotionConfig reducedMotion="user">` em components/motion-provider.tsx,
 * que resolve a preferência dentro do motor de animação (só depois da
 * hidratação) em vez de mudar os props renderizados — evitar isso no JSX é o
 * que evita divergência entre o HTML do servidor e o do cliente.
 */
export function useReveal(variants: Variants) {
  return {
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: viewportOnce,
    variants,
  }
}

/** Button com hover/tap elástico — usado por todo CTA em formato de pílula. */
export const MotionButton = motion.create(Button)
