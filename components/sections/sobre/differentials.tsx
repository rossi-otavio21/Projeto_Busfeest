'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { Wallet, UsersRound, Zap } from 'lucide-react'
import { fadeUp, iconPop, staggerContainer, useReveal } from '@/lib/motion'

const notes = [
  {
    icon: Wallet,
    title: 'Preço justo',
    description: 'Modelo low cost de verdade, sem custos escondidos.',
  },
  {
    icon: UsersRound,
    title: 'Foco em grupos',
    description: 'Entendemos a logística de mover muita gente junto.',
  },
  {
    icon: Zap,
    title: 'Orçamento rápido',
    description: 'Sem burocracia: resposta no WhatsApp, na hora.',
  },
]

const listStagger = staggerContainer(0.12, 0.3)

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controls = animate(0, target, {
      duration: reduceMotion ? 0 : 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [active, target])
  return value
}

export function Differentials() {
  const listReveal = useReveal(listStagger)
  const numberRef = useRef<HTMLDivElement>(null)
  const numberInView = useInView(numberRef, { once: true, margin: '-10% 0px' })
  const count = useCountUp(6, numberInView)

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-ink">
          <span aria-hidden="true" className="h-1.5 w-6 rounded-full bg-blue" />
          <span>Por que viajar com a Busfeest</span>
        </h2>

        <div className="mt-6 grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <div ref={numberRef}>
            <div className="text-[7rem] font-extrabold leading-[0.8] tracking-tighter text-navy sm:text-[9rem] md:text-[11rem]">
              {count}
            </div>
            <p className="max-w-[16ch] text-lg font-semibold text-blue-ink">
              anos rodando pelo Sul de Minas com preço justo
            </p>
          </div>

          <motion.ul {...listReveal} className="grid gap-8 sm:grid-cols-3 md:gap-6">
            {notes.map((item) => (
              <motion.li key={item.title} variants={fadeUp} className="flex flex-col gap-3">
                <motion.span
                  variants={iconPop}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-navy"
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </motion.span>
                <div>
                  <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm font-light leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
