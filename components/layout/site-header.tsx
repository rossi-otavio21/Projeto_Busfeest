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
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || open
          ? 'bg-navy/95 shadow-lg shadow-navy/20 backdrop-blur'
          : 'bg-transparent',
      )}
    >
      {/* Fio condutor: o mesmo grafismo de estrada atravessa toda página —
          reforça que é a mesma viagem, não uma seção nova a cada rota. */}
      <div
        aria-hidden="true"
        className="road-dashes absolute inset-x-0 bottom-0 h-px opacity-40"
      />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link
          href="/"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          aria-label="Busfeest — início"
        >
          <Logo variant="white" />
        </Link>

        {/* Navegação desktop */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative inline-block py-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue',
                      active ? 'text-white' : 'text-gray hover:text-white',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-blue transition-transform duration-300',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
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

      {/* Menu mobile — overlay fullscreen, desmontado do DOM quando fechado
          (AnimatePresence), o que já resolve o problema de links focáveis
          enquanto escondidos. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: easeBrand }}
            className="fixed inset-0 top-16 flex h-[calc(100svh-4rem)] flex-col justify-between overflow-y-auto bg-navy md:hidden"
          >
            <nav aria-label="Navegação mobile" className="flex-1 px-6 py-10">
              <ul className="flex flex-col">
                {navLinks.map((link, index) => {
                  const active = pathname === link.href
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: easeBrand, delay: 0.08 + index * 0.05 }}
                      className="border-b border-white/10"
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center justify-between py-5 text-3xl font-bold tracking-tight transition-colors',
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

            <div className="border-t border-white/10 px-6 py-8">
              <WhatsappCta
                message={HEADER_WHATSAPP_MESSAGE}
                size="cta-mobile"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Orçar pelo WhatsApp
              </WhatsappCta>
              <p className="mt-4 text-sm text-gray">{site.whatsapp.display}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
