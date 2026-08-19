/**
 * Projeção equirretangular do recorte regional do mapa de rotas.
 *
 * Compartilhada de propósito entre o gerador da malha
 * (scripts/gerar-malha-pontos.ts, que roda em build) e o componente que
 * desenha os arcos (rotas-mapa.tsx, que roda no navegador): os pontos da
 * malha e os pinos das cidades precisam sair exatamente da mesma conta,
 * senão o arco não encosta no ponto.
 *
 * Equirretangular basta aqui. A distorção da Mercator só aparece em recortes
 * de milhares de quilômetros em latitude; este cobre ~9 graus, e o fator
 * `cos(latitude média)` já corrige o esmagamento horizontal.
 */

export interface Moldura {
  lat: { min: number; max: number }
  lng: { min: number; max: number }
}

export interface Projecao {
  moldura: Moldura
  /** Unidades do viewBox por grau de longitude. */
  kx: number
  /** Idem por grau de latitude — maior que `kx`, corrigido pelo cosseno. */
  ky: number
  /** Dimensões do viewBox que essa projeção produz. */
  width: number
  height: number
}

export function criarProjecao(moldura: Moldura, colunas: number): Projecao {
  const latMedia = (moldura.lat.min + moldura.lat.max) / 2
  const kx = colunas / (moldura.lng.max - moldura.lng.min)
  const ky = kx / Math.cos((latMedia * Math.PI) / 180)
  return {
    moldura,
    kx,
    ky,
    width: colunas,
    height: Math.round((moldura.lat.max - moldura.lat.min) * ky),
  }
}

export interface Coordenada {
  lat: number
  lng: number
}

/** Coordenada geográfica → ponto no espaço do viewBox. */
export function projetar(projecao: Projecao, { lat, lng }: Coordenada) {
  return {
    x: (lng - projecao.moldura.lng.min) * projecao.kx,
    y: (projecao.moldura.lat.max - lat) * projecao.ky,
  }
}

/** Ponto do viewBox → coordenada geográfica. Usado só pelo gerador. */
export function desprojetar(projecao: Projecao, x: number, y: number): Coordenada {
  return {
    lng: projecao.moldura.lng.min + x / projecao.kx,
    lat: projecao.moldura.lat.max - y / projecao.ky,
  }
}
