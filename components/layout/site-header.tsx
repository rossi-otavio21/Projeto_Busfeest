'use client'

import { useEffect, useState } from 'react'
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <a
          href="#top"
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          aria-label="Busfeest — início"
        >
          <Logo variant="white" />
        </a>

        {/* Navegação desktop */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative inline-block py-1 text-sm font-medium text-gray transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-blue transition-transform duration-300 group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile — desmontado do DOM quando fechado (AnimatePresence), o que
          por si só já resolve o problema de links focáveis enquanto escondidos. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeBrand }}
            className="overflow-hidden border-t border-white/10 bg-navy md:hidden"
          >
            <nav aria-label="Navegação mobile" className="px-4 py-6">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-4 py-3 text-base font-medium text-gray transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <WhatsappCta
                message={HEADER_WHATSAPP_MESSAGE}
                size="cta-mobile"
                className="mt-4"
                onClick={() => setOpen(false)}
              >
                Orçar pelo WhatsApp
              </WhatsappCta>
              <p className="mt-4 px-4 text-sm text-gray">{site.whatsapp.display}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
