/**
 * Constantes centrais da Busfeest.
 * Fonte única de verdade para contato, navegação e mensagens de WhatsApp.
 */

const WHATSAPP_NUMBER = '5535997594706'

// TODO: defina NEXT_PUBLIC_SITE_URL nas env vars da Vercel quando o domínio
// final for escolhido — esse placeholder só existe para metadata/sitemap/robots
// não quebrarem em dev/preview antes disso.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://busfeest.vercel.app'

/** Monta um link de WhatsApp com mensagem pré-preenchida por seção. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const site = {
  name: 'Busfeest',
  tagline: 'O transporte que cabe no seu orçamento.',
  instagram: {
    handle: '@busfeest',
    url: 'https://instagram.com/busfeest',
  },
  whatsapp: {
    display: '(35) 9 9759-4706',
    number: WHATSAPP_NUMBER,
  },
  base: 'Alfenas — MG',
} as const

export const navLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Rotas', href: '#rotas' },
  { label: 'Contato', href: '#contato' },
] as const
