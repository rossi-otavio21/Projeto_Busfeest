import type { ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/components/ui/button'
import { whatsappLink } from '@/lib/site'

type ButtonVariant = VariantProps<typeof buttonVariants>['variant']
type ButtonSize = VariantProps<typeof buttonVariants>['size']

interface WhatsappCtaProps {
  /** Mensagem pré-preenchida enviada ao abrir a conversa. */
  message: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  onClick?: () => void
}

/** CTA de WhatsApp reutilizável: monta o link e aplica o estilo de pílula da marca. */
export function WhatsappCta({
  message,
  children,
  variant = 'cta',
  size = 'cta',
  className,
  onClick,
}: WhatsappCtaProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        />
      }
    >
      <MessageCircle aria-hidden="true" />
      {children}
    </Button>
  )
}
