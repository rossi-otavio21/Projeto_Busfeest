import { cn } from '@/lib/utils'

/**
 * Grafismos de marca derivados do logo.
 * Chevron/paralelogramo diagonal ("seta apontando para a direita"),
 * usado como chip de rota, banner e divisor. Alterna apenas entre as
 * 4 cores da paleta.
 */

type BrandColor = 'navy' | 'blue' | 'gray' | 'white'

const bgByColor: Record<BrandColor, string> = {
  navy: 'bg-navy text-white',
  blue: 'bg-blue text-white',
  gray: 'bg-gray text-navy',
  white: 'bg-white text-navy',
}

interface RouteChipProps {
  from: string
  to: string
  color?: BrandColor
  className?: string
}

/** Chip de rota no formato de "seta"/paralelogramo (grafismo da marca). */
export function RouteChip({ from, to, color = 'navy', className }: RouteChipProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 py-4 pl-5 pr-6 text-sm font-semibold',
        // Recorte em paralelogramo à direita (chevron), evocando movimento.
        '[clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%)]',
        bgByColor[color],
        className,
      )}
    >
      <span className="truncate">{from}</span>
      {/* Seta interna reforçando a direção da rota */}
      <ChevronMark className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span className="truncate">{to}</span>
    </div>
  )
}

/** Marca de chevron isolada (dupla seta), para detalhes e listas. */
export function ChevronMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 4l8 8-8 8M12 4l8 8-8 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Divisor de seção com o padrão de "estrada tracejada" em diagonal.
 * Usa o utility `road-dashes` definido no globals.css.
 */
export function RoadDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('road-dashes h-1.5 w-full opacity-70', className)}
    />
  )
}
