import { cn } from '@/lib/utils'

/**
 * Letreiro — o painel de destino do ônibus, transposto para a interface.
 *
 * Não é decoração genérica: o painel aparece literalmente nas fotos da
 * galeria ("BOA VIAGEM!!", "TURISMO", "BOA VIRGEM", "CARRO 01"), e é assim
 * que um grupo descobre que aquele ônibus é o dele. Rotular cada foto do
 * mesmo jeito que o ônibus se rotula é o grafismo desta seção — usado só
 * em dois lugares (o tile da galeria e a legenda do lightbox) e em nenhum
 * outro ponto do site.
 *
 * Fica dentro da paleta fechada da marca: painel navy-deep com a grade de
 * LEDs em navy-700 (utility `letreiro-panel`) e texto sólido em blue-soft.
 */

interface LetreiroProps {
  children: React.ReactNode
  /** `sm` no tile da galeria, `md` na legenda do lightbox. */
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'gap-2 px-2.5 py-1.5 text-[0.625rem] tracking-[0.16em]',
  md: 'gap-2.5 px-3.5 py-2 text-xs tracking-[0.18em] sm:text-sm',
} as const

const dotClasses = {
  sm: 'h-1 w-1',
  md: 'h-1.5 w-1.5',
} as const

export function Letreiro({ children, size = 'sm', className }: LetreiroProps) {
  return (
    <span
      className={cn(
        // `min-w-0` nos dois níveis: sem isso o `min-width:auto` padrão de
        // item flex trava a largura no tamanho do texto e o painel estoura a
        // coluna no mobile em vez de truncar (o destino completo continua na
        // legenda do lightbox).
        'letreiro-panel inline-flex min-w-0 max-w-full items-center rounded-[3px] font-semibold uppercase leading-none text-blue-soft',
        sizeClasses[size],
        className,
      )}
    >
      {/* Ponto piloto: o LED sempre aceso na ponta do painel real. */}
      <span
        aria-hidden="true"
        className={cn('shrink-0 rounded-full bg-blue', dotClasses[size])}
      />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  )
}
