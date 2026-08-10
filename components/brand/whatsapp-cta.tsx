import type { ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import { MotionButton, ctaTapSpring } from '@/lib/motion'
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
    <MotionButton
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={ctaTapSpring}
      render={
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        />
      }
    >
      <MessageCircle
        aria-hidden="true"
        className="transition-transform duration-300 group-hover/button:translate-x-0.5"
      />
      {children}
    </MotionButton>
  )
}
