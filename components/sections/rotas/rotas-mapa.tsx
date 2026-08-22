'use client'

import { motion } from 'framer-motion'
import { easeBrand, usePrefersReducedMotion } from '@/lib/motion'
import { pathMalha, projecaoMalha } from './malha-pontos.generated'
import { projetar } from './projecao'
import { cidadesAtendidas, rotasBase, rotasDestinos } from './rotas-data'

const { width, height } = projecaoMalha
const u = Math.max(width, height) / 200

const base = projetar(projecaoMalha, {
  lat: rotasBase.coords[1],
  lng: rotasBase.coords[0],
})

const rotas = rotasDestinos.map((destino) => {
  const ponto = projetar(projecaoMalha, {
    lat: destino.coords[1],
    lng: destino.coords[0],
  })
  const dx = ponto.x - base.x
  const dy = ponto.y - base.y
  const distancia = Math.hypot(dx, dy)
  const meioX = (base.x + ponto.x) / 2
  const meioY = (base.y + ponto.y) / 2
  const curvaX = meioX - (dy / distancia) * distancia * 0.2
  const curvaY = meioY + (dx / distancia) * distancia * 0.2

  return {
    ...destino,
    ponto,
    d: `M${base.x.toFixed(2)} ${base.y.toFixed(2)}Q${curvaX.toFixed(2)} ${curvaY.toFixed(2)} ${ponto.x.toFixed(2)} ${ponto.y.toFixed(2)}`,
  }
})

const destinosEmDestaque = new Set([rotasBase.name, ...rotasDestinos.map(({ name }) => name)])

const cidadesSecundarias = cidadesAtendidas
  .filter(({ name }) => !destinosEmDestaque.has(name))
  .map((cidade) => ({
    ...cidade,
    ponto: projetar(projecaoMalha, { lat: cidade.coords[1], lng: cidade.coords[0] }),
  }))

// Deslocamento do rótulo por destino, para nenhum cair sobre o traço da
// rota. Quem não estiver aqui usa o padrão (centralizado abaixo do pino) —
// sem isso, um destino novo entraria com `undefined` no className.
const labelClasses: Record<string, string> = {
  'Belo Horizonte': '-translate-y-full translate-x-2 -mt-3',
  Uberaba: '-translate-y-full -translate-x-3/4 -mt-3',
  'Ribeirão Preto': '-translate-x-full -translate-y-full -mt-3 -ml-3',
  'São Paulo': '-translate-x-1/2 translate-y-3',
}
const labelPadrao = '-translate-x-1/2 translate-y-3'

/** Um período completo do tracejado — a distância que a animação percorre. */
const periodoTracejado = u * 4.2

export function RotasMapa() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-navy-deep p-4 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.8)] sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">Malha de atendimento</p>
          <p className="mt-1 text-sm text-gray">Alfenas conecta a Busfeest aos principais polos de MG e SP.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray">
          <span className="rounded-full bg-blue/10 px-3 py-1.5 text-blue">22 cidades atendidas</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5">MG + SP</span>
        </div>
      </div>

      <div className="relative mt-4 aspect-[132/95] overflow-hidden rounded-2xl border border-white/10 bg-navy sm:mt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(199,204,209,.18) .6px, transparent .7px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-blue/15"
          style={{
            left: `${(base.x / width) * 100}%`,
            top: `${(base.y / height) * 100}%`,
            width: '54%',
            aspectRatio: '1',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="relative block h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="presentation"
          focusable="false"
        >
          <path d={pathMalha} stroke="var(--color-gray)" strokeWidth={u * 1.25} strokeLinecap="round" fill="none" opacity={0.36} />

          {cidadesSecundarias.map((cidade) => (
            <circle key={cidade.name} cx={cidade.ponto.x} cy={cidade.ponto.y} r={u * 0.8} fill="var(--color-gray)" opacity={0.48} />
          ))}

          {rotas.map((rota, indice) => (
            <g key={rota.name}>
              <path d={rota.d} stroke="var(--color-blue)" strokeWidth={u * 2.6} strokeLinecap="round" fill="none" opacity={0.14} />
              <motion.path
                d={rota.d}
                stroke="var(--color-blue)"
                strokeWidth={u * 1.05}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 1.05, ease: easeBrand, delay: indice * 0.13 }}
              />
              {/* Tracejado que corre no sentido da viagem. A classe
                  `animate-route-flow` (globals.css) desloca o traço em
                  exatamente um período, então o laço fecha sem salto. O
                  bloco global de `prefers-reduced-motion` já zera animações
                  CSS, então isto para sozinho sob movimento reduzido. */}
              <motion.path
                d={rota.d}
                className="animate-route-flow"
                style={{ ['--route-dash' as string]: periodoTracejado }}
                stroke="#ffffff"
                strokeWidth={u * 0.38}
                strokeDasharray={`${u * 1.4} ${u * 2.8}`}
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35, delay: 0.8 + indice * 0.13 }}
              />
              <circle cx={rota.ponto.x} cy={rota.ponto.y} r={u * 2.4} fill="var(--color-blue)" opacity={0.18} />
              <circle cx={rota.ponto.x} cy={rota.ponto.y} r={u * 1.35} fill="var(--color-blue)" stroke="#ffffff" strokeWidth={u * 0.55} />
            </g>
          ))}

          {!reduceMotion && (
            <circle cx={base.x} cy={base.y} r={u * 4} fill="none" stroke="var(--color-blue)" strokeWidth={u * 0.35} opacity={0.45}>
              <animate attributeName="r" values={`${u * 3};${u * 6};${u * 3}`} dur="3.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".45;.05;.45" dur="3.2s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={base.x} cy={base.y} r={u * 2.8} fill="var(--color-navy)" stroke="#ffffff" strokeWidth={u * 0.75} />
          <circle cx={base.x} cy={base.y} r={u * 0.9} fill="var(--color-blue)" />
        </svg>

        <div className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-full -mt-3 sm:block" style={{ left: `${(base.x / width) * 100}%`, top: `${(base.y / height) * 100}%` }}>
          <span className="whitespace-nowrap rounded-full bg-navy px-3 py-1.5 text-[10px] font-bold text-white shadow-lg sm:text-xs">
            Alfenas <span className="font-normal text-blue-soft">· Base operacional</span>
          </span>
        </div>

        {rotas.map((rota) => (
          <div
            key={rota.name}
            className={`pointer-events-none absolute z-10 hidden sm:block ${labelClasses[rota.name] ?? labelPadrao}`}
            style={{ left: `${(rota.ponto.x / width) * 100}%`, top: `${(rota.ponto.y / height) * 100}%` }}
          >
            <span className="whitespace-nowrap rounded-lg border border-white/15 bg-navy/95 px-2 py-1 text-[9px] font-bold text-white shadow-sm backdrop-blur sm:px-2.5 sm:text-[11px]">
              {rota.name} <span className="font-medium text-gray">· {rota.uf} · {rota.km} km</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-[11px] text-gray">
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full border-2 border-white bg-navy shadow-sm" />Base operacional</span>
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 bg-blue" />Rotas em destaque</span>
        <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-gray/60" />Cidades atendidas</span>
      </div>
    </div>
  )
}
