'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '@/components/brand/logo'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'
import { easeBrand } from '@/lib/motion'
import { navLinks, site } from '@/lib/site'
import { cn } from '@/lib/utils'

const HEADER_WHATSAPP_MESSAGE =
  'Olá! Vim pelo site da Busfeest e gostaria de um orçamento.'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'bg-navy/95 shadow-xl shadow-navy/20 backdrop-blur-md border-b border-white/10'
          : 'bg-gradient-to-b from-navy/80 via-navy/30 to-transparent',
      )}
    >
      {/* Fio condutor de estrada atravessando o topo */}
      <div
        aria-hidden="true"
        className="road-dashes absolute inset-x-0 bottom-0 h-0.5 opacity-40"
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 md:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            aria-label="Busfeest — início"
          >
            <Logo variant="white" />
          </Link>

          {/* Badge de status da jornada — reforça a identidade de viagem no desktop */}
          <span aria-hidden="true" className="hidden lg:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray">
            <span className="h-1.5 w-1.5 rounded-full bg-blue animate-pulse" />
            Alfenas — MG ➔ Sul de Minas
          </span>
        </div>

        {/* Navegação desktop estilo editorial */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative inline-block py-1 text-xs font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue',
                      active ? 'text-white' : 'text-gray/80 hover:text-white',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-blue transition-transform duration-300',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <WhatsappCta
            message={HEADER_WHATSAPP_MESSAGE}
            size="cta-sm"
            className="hidden md:inline-flex"
          >
            Orçar pelo WhatsApp
          </WhatsappCta>

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

      {/* Menu mobile — overlay editorial fullscreen */}
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
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const active = pathname === link.href
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: easeBrand, delay: 0.08 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between py-4 text-3xl font-extrabold tracking-tight transition-colors border-b border-white/5',
                          active ? 'text-blue' : 'text-white hover:text-blue',
                        )}
                      >
                        <span>{link.label}</span>
                        <span className="text-xs font-mono text-gray/50">0{index + 1}</span>
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
                className="w-full"
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
