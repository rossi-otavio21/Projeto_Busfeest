/**
 * Logotipo Busfeest — assinatura composta: símbolo ("B" estilizado como
 * estrada/seta em curva) + wordmark BUSFEEST em caixa alta (Sora).
 *
 * Tratado como asset vetorial fixo. Duas versões documentadas:
 *  - variant="color": gradiente navy → azul médio, para fundos claros.
 *  - variant="white": monocromático branco, para o fundo azul-marinho.
 * Não recolorir, distorcer proporções ou aplicar efeitos fora destes.
 */

type LogoVariant = 'color' | 'white'

interface LogoProps {
  variant?: LogoVariant
  /** Mostra apenas o símbolo, sem o wordmark. */
  markOnly?: boolean
  className?: string
}

export function Logo({
  variant = 'color',
  markOnly = false,
  className,
}: LogoProps) {
  const gradientId = `bf-grad-${variant}`
  // Cor do símbolo: gradiente na versão colorida, branco sólido na monocromática.
  const markFill = variant === 'white' ? '#FFFFFF' : `url(#${gradientId})`
  const wordFill = variant === 'white' ? '#FFFFFF' : '#122B42'

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
    >
      {/* Símbolo: badge com estrada em curva + seta, evocando um "B" em movimento */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        role="img"
        aria-label="Símbolo Busfeest"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#122B42" />
            <stop offset="1" stopColor="#3695C5" />
          </linearGradient>
        </defs>
        {/* Contorno do badge */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill={markFill}
        />
        {/* Estrada em curva (forma o traço do "B") — recorte em negativo */}
        <path
          d="M16 12c8 0 8 8 0 8h6c8 0 8 8 0 8h-6"
          stroke={variant === 'white' ? '#122B42' : '#FFFFFF'}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Faixa central tracejada da estrada */}
        <path
          d="M14 34h13"
          stroke={variant === 'white' ? '#122B42' : '#FFFFFF'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="1 5"
        />
        {/* Seta apontando para a direita (movimento) */}
        <path
          d="M30 30l5 4-5 4"
          stroke={variant === 'white' ? '#122B42' : '#FFFFFF'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {!markOnly && (
        <svg
          height="20"
          viewBox="0 0 168 22"
          fill="none"
          role="img"
          aria-label="Busfeest"
          style={{ display: 'block' }}
        >
          <text
            x="0"
            y="17"
            fill={wordFill}
            fontFamily="var(--font-sora), system-ui, sans-serif"
            fontSize="21"
            fontWeight="700"
            letterSpacing="1.5"
          >
            BUSFEEST
          </text>
        </svg>
      )}
    </span>
  )
}
