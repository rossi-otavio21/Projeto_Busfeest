'use client'

import { motion } from 'framer-motion'
import { easeBrand, usePrefersReducedMotion, viewportOnce } from '@/lib/motion'
import { pathMalha, projecaoMalha } from './malha-pontos.generated'
import { projetar } from './projecao'
import { rotasBase, rotasDestinos } from './rotas-data'

/**
 * Mapa da rede de rotas — malha pontilhada de Minas Gerais e São Paulo, com
 * a base em Alfenas ligada por arco aos quatro destinos principais.
 *
 * É grafismo, não informação: `aria-hidden` no contêiner porque tudo o que o
 * mapa mostra está escrito logo abaixo, em RotasCobertura — que lê melhor
 * num leitor de tela do que qualquer descrição da malha.
 *
 * Aqui havia um mapa MapLibre (WebGL + worker vendorizado em /public +
 * geojson servido ao navegador, ~1,6 MB) para desenhar um elemento sem
 * nenhuma interação. Agora são dois `<path>`: a malha vem pronta de
 * malha-pontos.generated.ts e os arcos saem de rotas-data no render. Não
 * voltar para mapa de tiles sem uma necessidade de navegação de verdade.
 */

const { width, height } = projecaoMalha

/** Espessura de traço em unidades do viewBox, para escalar junto com o mapa. */
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
  const meioX = (base.x + ponto.x) / 2
  const meioY = (base.y + ponto.y) / 2
  const dx = ponto.x - base.x
  const dy = ponto.y - base.y
  const distancia = Math.hypot(dx, dy)
  // Controle deslocado na perpendicular do segmento: dá a curvatura de rota
  // aérea sem precisar de great-circle — em 300 km a diferença é invisível.
  const curvaX = meioX - (dy / distancia) * distancia * 0.24
  const curvaY = meioY + (dx / distancia) * distancia * 0.24
  return {
    name: destino.name,
    ponto,
    d: `M${base.x.toFixed(2)} ${base.y.toFixed(2)}Q${curvaX.toFixed(2)} ${curvaY.toFixed(2)} ${ponto.x.toFixed(2)} ${ponto.y.toFixed(2)}`,
  }
})

export function RotasMapa() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-navy-deep shadow-2xl"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        // MG e SP juntos formam uma região quase quadrada, então o quadro
        // seria alto demais no desktop se seguisse só a proporção. O teto de
        // altura resolve, e `meet` mantém a silhueta inteira — o que sobra
        // vira margem no navy do contêiner, nunca recorte. Em telas
        // estreitas a largura manda antes do teto, e o teto não entra.
        className="mx-auto block h-auto max-h-[420px] w-full md:max-h-[500px]"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        focusable="false"
      >
        {/* Malha: um path só, com os pontos como traços de comprimento zero
            e ponta redonda. Cada ponto custa ~12 bytes em vez dos ~65 de um
            <circle> — 1.437 pontos cabem em 17 KB. */}
        <path
          d={pathMalha}
          stroke="var(--color-gray)"
          strokeWidth={u * 2}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />

        {/* Arcos das rotas âncora */}
        {rotas.map((rota, indice) => (
          <motion.path
            key={rota.name}
            d={rota.d}
            stroke="var(--color-blue)"
            strokeWidth={u * 0.9}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={viewportOnce}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.1, ease: easeBrand, delay: 0.15 + indice * 0.12 }
            }
          />
        ))}

        {/* Destinos */}
        {rotas.map((rota) => (
          <circle
            key={rota.name}
            cx={rota.ponto.x}
            cy={rota.ponto.y}
            r={u * 1.5}
            fill="var(--color-blue)"
          />
        ))}

        {/* Base — único elemento em destaque do mapa: um disco com anel
            branco. Sem pulso somado a sombra somada a ícone. */}
        <circle
          cx={base.x}
          cy={base.y}
          r={u * 2.6}
          fill="var(--color-blue)"
          stroke="#ffffff"
          strokeWidth={u * 0.7}
        />
      </svg>
    </div>
  )
}
