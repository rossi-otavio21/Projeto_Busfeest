'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Logo } from '@/components/brand/logo'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { easeBrand, usePrefersReducedMotion } from '@/lib/motion'
import { navLinks, site } from '@/lib/site'
import { cn } from '@/lib/utils'

const HEADER_WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Busfeest e gostaria de um orçamento.'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const pathname = usePathname()

  // Header ganha fundo sólido navy ao rolar, para manter contraste do logo branco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Trava o scroll do body quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled || open
          ? 'bg-navy/95 shadow-xl shadow-navy/20 backdrop-blur-lg border-b border-white/10'
          : 'bg-gradient-to-b from-navy/80 via-navy/30 to-transparent',
      )}
    >
      {/* Farol de longo alcance — hairline azul que acende ao rolar, no topo do header */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/70 to-transparent transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Fio condutor de estrada atravessando o topo — intensifica ao rolar */}
      <div
        aria-hidden="true"
        className={cn(
          'road-dashes absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-500',
          scrolled ? 'opacity-70' : 'opacity-40',
        )}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 md:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="rounded-md transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            aria-label="Busfeest — início"
          >
            <Logo variant="white" />
          </Link>

          <RouteReadout />
        </div>

        {/* Navegação desktop — indicador de trajeto compartilhado entre os links */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul
            className="flex items-center gap-7"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href
              const isTarget = hoveredHref ? hoveredHref === link.href : active
              return (
                <li key={link.href} onMouseEnter={() => setHoveredHref(link.href)}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative inline-block py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:tracking-[0.2em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue',
                      active || hoveredHref === link.href
                        ? 'text-white'
                        : 'text-gray/80 hover:text-white',
                    )}
                  >
                    {link.label}
                    {isTarget && (
                      <motion.span
                        layoutId="nav-route-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-x-0 -bottom-1.5 h-[2px]"
                      >
                        <span className="absolute inset-0 rounded-full bg-blue" />
                        <span
                          aria-hidden="true"
                          className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-blue"
                          style={{ boxShadow: '0 0 6px 2px rgba(54, 149, 197, 0.7)' }}
                        />
                      </motion.span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <MagneticWrap className="hidden md:inline-flex">
            <WhatsappCta
              message={HEADER_WHATSAPP_MESSAGE}
              size="cta-sm"
              className="shadow-lg shadow-blue/0 transition-shadow duration-300 hover:shadow-blue/40"
            >
              Orçar pelo WhatsApp
            </WhatsappCta>
          </MagneticWrap>

          {/* Botão do menu mobile */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile — itinerário: paradas numeradas ligadas por uma linha de rota tracejada */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: easeBrand }}
            className="fixed inset-0 top-16 flex h-[calc(100svh-4rem)] flex-col justify-between overflow-y-auto bg-navy px-6 py-8 md:hidden"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-blue">
              <span className="h-2 w-2 rounded-full bg-blue" />
              Menu de Trajeto · Busfeest
            </div>

            <nav aria-label="Navegação mobile" className="flex-1 py-6">
              <ul className="relative flex flex-col gap-1">
                {/* Linha de rota vertical — conecta as paradas (páginas) do itinerário */}
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-6 bottom-6 border-l border-dashed border-white/15"
                />
                {navLinks.map((link, index) => {
                  const active = pathname === link.href
                  return (
                    <motion.li
                      key={link.href}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: easeBrand, delay: 0.08 + index * 0.05 }}
                    >
                      {/* Marcador da parada */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border text-[0.65rem] font-bold transition-colors',
                          active
                            ? 'border-blue bg-blue text-white'
                            : 'border-white/20 bg-navy text-gray/60',
                        )}
                      >
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        ) : (
                          `0${index + 1}`
                        )}
                      </span>

                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center border-b border-white/5 py-4 pl-12 text-3xl font-extrabold tracking-tight transition-colors',
                          active ? 'text-blue' : 'text-white hover:text-blue',
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </nav>

            <div className="border-t border-white/10 pt-6">
              <WhatsappCta
                message={HEADER_WHATSAPP_MESSAGE}
                size="cta-mobile"
                className="w-full shadow-[0_8px_30px_-8px_rgba(54,149,197,0.45)]"
                onClick={() => setOpen(false)}
              >
                Orçar pelo WhatsApp
              </WhatsappCta>
              <p className="mt-4 text-center text-xs tracking-wider text-gray">{site.whatsapp.display} · Base Alfenas-MG</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/**
 * Indicador de trajeto no header — substitui o badge estático por uma leitura
 * tipo "painel de embarque": ponto de partida pulsante, micro-rota tracejada
 * e um marcador que percorre o trajeto até o destino. Só aparece em telas
 * largas, onde há espaço para não competir com a navegação.
 */
function RouteReadout() {
  return (
    <div
      aria-hidden="true"
      className="ml-2 hidden items-center gap-2.5 border-l border-white/10 pl-5 lg:flex"
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue" />
      </span>
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white">
        Alfenas — MG
      </span>
      <span className="route-track relative h-px w-9 shrink-0 overflow-visible">
        <motion.span
          className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-blue"
          style={{ boxShadow: '0 0 5px 1px rgba(54, 149, 197, 0.85)' }}
          animate={{ left: ['0%', '92%'] }}
          transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        />
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gray/70">
        Sul de Minas
      </span>
    </div>
  )
}

/**
 * Envelope magnético para o CTA do header — o botão desliza sutilmente em
 * direção ao cursor, como um pequeno "convite ao embarque". Escopo local ao
 * header (não altera o `WhatsappCta` compartilhado usado em outras seções).
 * Desligado quando o usuário prefere movimento reduzido.
 */
function MagneticWrap({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.3)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
