/**
 * Ícones que não existem na versão reduzida do lucide-react instalada.
 * Mantidos como SVGs simples, herdando currentColor.
 */

interface InstagramGlyphProps {
  className?: string
  /** 'mono' herda currentColor (uso padrão, ex. rodapé). 'gradient' usa o
   * gradiente oficial da marca — reservado para pontos de destaque (Contato). */
  variant?: 'mono' | 'gradient'
}

export function InstagramGlyph({ className, variant = 'mono' }: InstagramGlyphProps) {
  const gradient = variant === 'gradient'
  const stroke = gradient ? 'url(#instagram-brand-gradient)' : 'currentColor'
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {gradient && (
        <defs>
          <linearGradient id="instagram-brand-gradient" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0%" stopColor="#feda75" />
            <stop offset="35%" stopColor="#d62976" />
            <stop offset="70%" stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
      )}
      <rect x="3" y="3" width="18" height="18" rx="5" stroke={stroke} strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke={stroke} strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill={stroke} />
    </svg>
  )
}

/**
 * Selo do WhatsApp com a cor oficial da marca — reservado para pontos de
 * destaque (ex. Contato) como exceção deliberada à paleta fechada da
 * Busfeest: reconhecer "isso é WhatsApp" à primeira vista é o objetivo.
 */
export function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M15.85 13.4c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.51.64-.63.77-.12.13-.23.15-.43.05-.2-.1-.86-.32-1.63-1.01-.6-.54-1.01-1.2-1.13-1.4-.12-.2-.01-.31.09-.4.09-.1.2-.24.3-.36.1-.12.13-.2.2-.33.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.61-1.48-.16-.39-.33-.33-.45-.34h-.38c-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.62s.7 1.88.8 2.01c.1.13 1.37 2.1 3.33 2.94.47.2.83.32 1.11.41.47.15.9.13 1.24.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.09-.18-.14-.38-.24Z"
        fill="#fff"
      />
    </svg>
  )
}
