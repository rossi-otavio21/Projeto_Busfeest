import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { InstagramGlyph, WhatsappGlyph } from '@/components/brand/icons'
import { cn } from '@/lib/utils'

/**
 * Componente vendorizado (registro de componentes React) — adaptações locais:
 * 1. Ícones sociais trocados de GitHub/Twitter/YouTube/LinkedIn (irrelevantes
 *    pra uma empresa de transporte) para Instagram/WhatsApp, os canais reais
 *    da Busfeest — reaproveitando os glyphs de marca já existentes.
 * 2. Cores cinza/preto genéricas trocadas pelos tokens da paleta fechada da
 *    marca (navy/gray/white). Removidas as variantes `dark:` — o projeto não
 *    tem modo escuro.
 */

export interface ProfileCardProps {
  name?: string
  title?: string
  description?: string
  imageUrl?: string
  instagramUrl?: string
  whatsappUrl?: string
  className?: string
}

export function ProfileCard(props: ProfileCardProps) {
  const {
    name = 'Michael Chen',
    title = 'Senior Software Engineer, Cloud Infrastructure',
    description = 'Michael Chen is a seasoned software engineer at TechFlow Solutions with over 8 years of experience building scalable cloud infrastructure and microservices.',
    imageUrl = '/images/eventos/busfeest-unigames-embarque.jpg',
    instagramUrl = '#',
    whatsappUrl = '#',
    className,
  } = props

  const socialIcons = [
    { Glyph: InstagramGlyph, url: instagramUrl, label: 'Instagram' },
    { Glyph: WhatsappGlyph, url: whatsappUrl, label: 'WhatsApp' },
  ]

  return (
    <div className={cn('mx-auto w-full max-w-5xl px-4', className)}>
      {/* Desktop */}
      <div className="relative hidden items-center md:flex">
        {/* Foto quadrada */}
        <div className="flex h-[470px] w-[470px] flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            width={470}
            height={470}
            className="h-full w-full object-cover"
            draggable={false}
            priority
          />
        </div>
        {/* Card sobreposto */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="z-10 ml-[-80px] max-w-xl flex-1 rounded-3xl bg-white p-8 shadow-2xl"
        >
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-navy">{name}</h2>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>

          <p className="mb-8 text-base leading-relaxed text-navy">{description}</p>

          <div className="flex space-x-4">
            {socialIcons.map(({ Glyph, url, label }) => (
              <Link
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-navy transition-colors hover:scale-105 hover:bg-navy-deep"
                aria-label={label}
              >
                <Glyph className="h-5 w-5 text-white" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-sm bg-transparent text-center md:hidden"
      >
        <div className="mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover"
            draggable={false}
            priority
          />
        </div>

        <div className="px-4">
          <h2 className="mb-2 text-xl font-bold text-navy">{name}</h2>
          <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mb-6 text-sm leading-relaxed text-navy">{description}</p>

          <div className="flex justify-center space-x-4">
            {socialIcons.map(({ Glyph, url, label }) => (
              <Link
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-navy transition-colors hover:bg-navy-deep"
                aria-label={label}
              >
                <Glyph className="h-5 w-5 text-white" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
