/**
 * Logotipo Busfeest — assinatura composta: símbolo ("B" com a estrada em
 * perspectiva) + wordmark BUSFEEST.
 *
 * Assets oficiais, extraídos da prancha de marca e servidos de
 * public/images/brand. Duas versões documentadas:
 *  - variant="color": azul degradê, para fundos claros.
 *  - variant="white": knockout branco, para o fundo azul-marinho.
 * Não recolorir, distorcer proporções ou aplicar efeitos fora destes.
 *
 * O símbolo branco é knockout: as faixas da estrada são vazadas e deixam o
 * fundo aparecer, então ele só deve ser usado sobre navy sólido.
 */

import Image from 'next/image'

type LogoVariant = 'color' | 'white'

// Proporções derivadas dos arquivos (459x420 e 846x120), reduzidas ao tamanho
// de exibição para o next/image servir o menor arquivo possível.
const MARK = {
  white: '/images/brand/busfeest-simbolo-branco.png',
  color: '/images/brand/busfeest-simbolo-cor.png',
} as const

const WORDMARK = {
  white: '/images/brand/busfeest-wordmark-branco.png',
  color: '/images/brand/busfeest-wordmark-navy.png',
} as const

interface LogoProps {
  variant?: LogoVariant
  /** Mostra apenas o símbolo, sem o wordmark. */
  markOnly?: boolean
  /** Use no logo do header — está acima da dobra e não deve carregar tarde. */
  priority?: boolean
  className?: string
}

export function Logo({
  variant = 'color',
  markOnly = false,
  priority = false,
  className,
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className ?? ''}`}
      role="img"
      aria-label="Busfeest"
    >
      <Image
        src={MARK[variant]}
        alt=""
        width={44}
        height={40}
        priority={priority}
        className="h-10 w-11 shrink-0"
      />

      {!markOnly && (
        <Image
          src={WORDMARK[variant]}
          alt=""
          width={141}
          height={20}
          priority={priority}
          // Largura fixa em vez de `w-auto`: o next/image redimensiona o
          // arquivo para uma variante cuja razão arredonda (256x36 = 7.111
          // contra os 7.05 do original), e `w-auto` derivaria a largura
          // dessa variante — 1,2px a mais que o declarado, o bastante para
          // o Next avisar de proporção modificada em toda página.
          className="h-5 w-[141px] shrink-0"
        />
      )}
    </span>
  )
}
