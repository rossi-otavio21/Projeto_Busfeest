import Link from 'next/link'
import { MessageCircle, MapPin } from 'lucide-react'
import { InstagramGlyph } from '@/components/brand/icons'
import { Logo } from '@/components/brand/logo'
import { navLinks, site, whatsappLink } from '@/lib/site'

export function SiteFooter() {
  const whatsapp = whatsappLink('Olá! Vim pelo site da Busfeest.')

  return (
    <footer className="border-t border-white/10 bg-navy-deep py-14 text-gray">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Marca */}
          <div>
            <Logo variant="white" />
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed">
              {site.tagline} Turismo low cost e fretamento para grupos no sul de
              Minas Gerais.
            </p>
          </div>

          {/* Links rápidos */}
          <nav aria-label="Links rápidos">
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Navegação
            </p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Contato
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  <MessageCircle className="h-4 w-4 text-blue" aria-hidden="true" />
                  {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  <InstagramGlyph className="h-4 w-4 text-blue" />
                  {site.instagram.handle}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-blue" aria-hidden="true" />
                Base em {site.base}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 text-xs text-gray/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos
            reservados.
          </p>
          <Link
            href="/contato"
            className="font-semibold text-blue underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            Fale conosco →
          </Link>
        </div>
      </div>
    </footer>
  )
}
