'use client'

import { motion, type Variants } from 'framer-motion'
import { drawLine, staggerContainer, useReveal } from '@/lib/motion'
import { whatsappLink } from '@/lib/site'

// Rotas atendidas partindo da base em Alfenas, em ordem crescente de
// distância — reforça a leitura de trajeto. Distâncias rodoviárias
// aproximadas.
const stops = [
  { city: 'Alfenas', origin: true as const },
  { city: 'Ribeirão Preto', km: 260 },
  { city: 'Belo Horizonte', km: 350 },
  { city: 'São Paulo', km: 360 },
  { city: 'Uberaba', km: 380 },
]

const stopReveal: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 22 } },
}

const stopStagger = staggerContainer(0.12, 0.3)

export function RotasMap() {
  const whatsapp = whatsappLink(
    'Olá! Gostaria de saber sobre as rotas atendidas pela Busfeest.',
  )
  const lineReveal = useReveal(drawLine)
  const stopsReveal = useReveal(stopStagger)

  return (
    <section className="bg-navy pb-20 pt-32 md:pb-28 md:pt-44">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue">
            De onde partimos, para onde vamos
          </span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl">
            Conectando o sul de Minas e além
          </h1>
          <p className="mt-5 text-lg font-light leading-relaxed text-gray">
            Com base em Alfenas, chegamos aos principais destinos da região — a
            linha abaixo mostra o trajeto: quanto mais longe, mais à direita
            (distâncias rodoviárias aproximadas).
          </p>
        </div>

        {/* Trajeto — desktop: horizontal; mobile: empilhado verticalmente */}
        <div className="relative mt-20 hidden md:block">
          <motion.div
            {...lineReveal}
            style={{ transformOrigin: 'left' }}
            className="road-dashes absolute left-0 right-0 top-[5px] h-1.5 opacity-80"
          />
          <motion.ul {...stopsReveal} className="relative flex items-start justify-between">
            {stops.map((stop) => (
              <motion.li key={stop.city} variants={stopReveal} className="flex flex-col items-center gap-3">
                <span
                  className={
                    stop.origin
                      ? 'h-4 w-4 rounded-full bg-white ring-4 ring-white/20'
                      : 'h-3.5 w-3.5 rounded-full bg-blue ring-4 ring-blue/25'
                  }
                />
                <span className="text-sm font-bold text-white">{stop.city}</span>
                <span className="text-xs text-gray">
                  {stop.origin ? 'base' : `≈ ${stop.km} km`}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative mt-16 md:hidden">
          <motion.div
            {...lineReveal}
            style={{ transformOrigin: 'top' }}
            className="road-dashes absolute left-[5px] top-0 bottom-0 w-1.5 opacity-80"
          />
          <motion.ul {...stopsReveal} className="relative flex flex-col gap-7">
            {stops.map((stop) => (
              <motion.li key={stop.city} variants={stopReveal} className="flex items-center gap-4">
                <span
                  className={
                    stop.origin
                      ? 'h-4 w-4 shrink-0 rounded-full bg-white ring-4 ring-white/20'
                      : 'h-3.5 w-3.5 shrink-0 rounded-full bg-blue ring-4 ring-blue/25'
                  }
                />
                <span className="text-sm font-bold text-white">{stop.city}</span>
                <span className="text-xs text-gray">
                  {stop.origin ? 'base' : `≈ ${stop.km} km`}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <p className="mt-16 text-gray">
          Também fazemos conexão com aeroportos regionais e montamos rotas sob
          medida.{' '}
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            Fale com a gente pelo WhatsApp
          </a>{' '}
          e vemos o seu destino.
        </p>
      </div>
    </section>
  )
}
