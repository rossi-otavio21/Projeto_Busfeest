/**
 * Gera a malha pontilhada do mapa de rotas.
 *
 *   pnpm gerar:malha
 *
 * Lê os polígonos estaduais do IBGE (data/br-estados.json), varre uma grade
 * diagonal sobre o recorte e guarda só os pontos que caem dentro de Minas
 * Gerais ou São Paulo. A saída é um `<path>` pronto, versionado em
 * components/sections/rotas/malha-pontos.generated.ts — o navegador nunca vê
 * o geojson nem roda point-in-polygon.
 *
 * Por que os estados e não a silhueta de país: neste recorte (~1.300 km,
 * inteiramente dentro do Brasil) não existe contorno de país para desenhar —
 * o mapa vira um retângulo cheio de pontos. São as divisas de MG e SP que
 * fazem a região ser reconhecível.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  criarProjecao,
  desprojetar,
  projetar,
  type Moldura,
} from '../components/sections/rotas/projecao.ts'
import { rotasBase, rotasDestinos } from '../components/sections/rotas/rotas-data.ts'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── Parâmetros da malha ───────────────────────────────────────────────────
// Moldura única para todas as larguras: o SVG escala pela largura e a altura
// acompanha a proporção, então não há recorte a ajustar por breakpoint.
// Abrir mais que isto afasta demais os arcos; fechar mais corta MG e SP no
// meio e a silhueta deixa de ser reconhecível.
const MOLDURA: Moldura = {
  lat: { min: -26.0, max: -17.3 },
  lng: { min: -53.2, max: -40.2 },
}
/** Colunas do viewBox. Mais colunas = mais pontos = arquivo maior. */
const COLUNAS = 132
/** Passo da grade, em unidades de viewBox. */
const PASSO = 1.7
/** Estados desenhados. */
const UFS = ['MG', 'SP'] as const

// ── Geometria ─────────────────────────────────────────────────────────────
interface Feature {
  properties: { sigla: string; name: string }
  geometry: { type: 'MultiPolygon'; coordinates: number[][][][] }
}

function dentroDoAnel(lng: number, lat: number, anel: number[][]): boolean {
  let dentro = false
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const [xi, yi] = anel[i]
    const [xj, yj] = anel[j]
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      dentro = !dentro
    }
  }
  return dentro
}

/** Ray casting, respeitando buracos (anéis internos) do MultiPolygon. */
function dentroDaUf(lng: number, lat: number, feature: Feature): boolean {
  for (const poligono of feature.geometry.coordinates) {
    if (!dentroDoAnel(lng, lat, poligono[0])) continue
    let emBuraco = false
    for (let h = 1; h < poligono.length; h++) {
      if (dentroDoAnel(lng, lat, poligono[h])) {
        emBuraco = true
        break
      }
    }
    if (!emBuraco) return true
  }
  return false
}

function caixa(feature: Feature) {
  let oeste = 180
  let sul = 90
  let leste = -180
  let norte = -90
  for (const poligono of feature.geometry.coordinates) {
    for (const [x, y] of poligono[0]) {
      if (x < oeste) oeste = x
      if (x > leste) leste = x
      if (y < sul) sul = y
      if (y > norte) norte = y
    }
  }
  return { oeste, sul, leste, norte }
}

// ── Execução ──────────────────────────────────────────────────────────────
const geo = JSON.parse(
  readFileSync(join(raiz, 'data/br-estados.json'), 'utf8'),
) as { features: Feature[] }

const alvos = UFS.map((sigla) => {
  const feature = geo.features.find((f) => f.properties.sigla === sigla)
  if (!feature) throw new Error(`UF ${sigla} não existe em data/br-estados.json`)
  return { feature, caixa: caixa(feature) }
})

const projecao = criarProjecao(MOLDURA, COLUNAS)

const pontos: Array<{ x: number; y: number }> = []
for (let linha = 0; linha * PASSO * 0.866 <= projecao.height; linha++) {
  const y = linha * PASSO * 0.866
  // Linhas ímpares deslocam meio passo: é isso que dá a grade diagonal, em
  // vez de um quadriculado que produz corredores verticais no olho.
  const recuo = linha % 2 ? PASSO / 2 : 0
  for (let coluna = 0; ; coluna++) {
    const x = coluna * PASSO + recuo
    if (x > projecao.width) break
    const { lat, lng } = desprojetar(projecao, x, y)
    for (const alvo of alvos) {
      if (lng < alvo.caixa.oeste || lng > alvo.caixa.leste) continue
      if (lat < alvo.caixa.sul || lat > alvo.caixa.norte) continue
      if (dentroDaUf(lng, lat, alvo.feature)) {
        pontos.push({ x, y })
        break
      }
    }
  }
}

// Cada ponto vira um `M x y h0` num único path, desenhado com
// stroke-linecap:round — ~12 bytes por ponto contra ~65 de um <circle>.
const path = pontos.map((p) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`).join('')

// Confere que a base e todos os destinos com arco caem dentro do recorte.
// Se alguém acrescentar um destino longe, isto avisa na hora de regerar em
// vez de deixar um arco apontando para fora do quadro.
const comArco = [rotasBase, ...rotasDestinos].map((cidade) => ({
  name: cidade.name,
  lat: cidade.coords[1],
  lng: cidade.coords[0],
}))
const fora = comArco.filter(({ lat, lng }) => {
  const p = projetar(projecao, { lat, lng })
  return p.x < 0 || p.y < 0 || p.x > projecao.width || p.y > projecao.height
})
if (fora.length) {
  throw new Error(
    `Fora da moldura: ${fora.map((c) => c.name).join(', ')}. ` +
      `Abra MOLDURA em scripts/gerar-malha-pontos.ts e rode de novo.`,
  )
}

const saida = `/**
 * ARQUIVO GERADO — não editar à mão.
 *
 * Regerar com:  pnpm gerar:malha
 * Gerador:      scripts/gerar-malha-pontos.ts
 * Fonte:        data/br-estados.json (malha estadual do IBGE)
 *
 * Editar aqui é trabalho perdido: a próxima rodada do gerador sobrescreve.
 * Para mudar o recorte ou a densidade, mexa nas constantes do gerador.
 */

import type { Projecao } from './projecao'

/** Projeção usada para gerar os pontos. Os pinos precisam usar esta mesma. */
export const projecaoMalha: Projecao = ${JSON.stringify(projecao, null, 2)
  .split('\n')
  .join('\n')}

/** ${pontos.length} pontos de ${UFS.join(' + ')}, num path só. */
export const pathMalha =
  '${path}'

/** Quantos pontos o path acima contém — usado só em teste/diagnóstico. */
export const totalPontosMalha = ${pontos.length}
`

const destino = join(raiz, 'components/sections/rotas/malha-pontos.generated.ts')
writeFileSync(destino, saida, 'utf8')

console.log(
  `malha-pontos.generated.ts: ${pontos.length} pontos, ` +
    `viewBox ${projecao.width}×${projecao.height}, ` +
    `${(path.length / 1024).toFixed(1)} KB de path`,
)
