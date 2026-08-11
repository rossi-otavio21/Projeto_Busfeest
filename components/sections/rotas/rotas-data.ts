/**
 * Rede de rotas da Busfeest partindo da base em Alfenas.
 * Fonte única para o mapa (RotasFlightMap) e para os cards de rota —
 * para adicionar um destino novo, basta acrescentar um item aqui.
 * Distâncias rodoviárias aproximadas; coords em [longitude, latitude].
 */

export interface RotaDestino {
  name: string
  uf: 'MG' | 'SP'
  km: number
  coords: [number, number]
  /** Lado do rótulo no mapa — alternado para os nomes não colidirem entre si. */
  labelPosition: 'top' | 'bottom'
  /**
   * Foto da cidade no card. Sem foto, o card mostra um grafismo da marca no
   * lugar — para publicar uma foto nova, basta acrescentar `photo` aqui.
   * `position` ajusta o recorte (padrão: centro) quando o assunto não está
   * no meio do quadro.
   */
  photo?: { src: string; alt: string; position?: string }
}

export const rotasBase = {
  name: 'Alfenas',
  uf: 'MG' as const,
  coords: [-45.9477, -21.4256] as [number, number],
}

export const rotasDestinos: RotaDestino[] = [
  { name: 'Ribeirão Preto', 
    uf: 'SP', 
    km: 260, 
    coords: [-47.8103, -21.1775], 
    labelPosition: 'top',
    photo: {
      src: '/images/banco/ribeiraopreto.jpg',
      alt: 'Vista aérea dos prédios de Ribeirão Preto sob céu azul',
      position: '50% 88%',
    }
  },
  
  {
    name: 'Belo Horizonte',
    uf: 'MG',
    km: 350,
    coords: [-43.9345, -19.9167],
    labelPosition: 'top',
    // Foto vertical: o céu ocupa a maior parte do quadro, então o recorte
    // puxa para baixo, onde estão os prédios.
    photo: {
      src: '/images/banco/banco-skyline-belo-horizonte.jpg',
      alt: 'Vista aérea dos prédios de Belo Horizonte sob céu azul',
      position: '50% 88%',
    },
  },
  // Ao sul de todos — rótulo embaixo, longe do pino de Alfenas.
  { name: 'São Paulo',
    uf: 'SP', 
    km: 360, 
    coords: [-46.6333, -23.5505], 
    labelPosition: 'bottom',
    photo: {
      src: '/images/banco/saopaulo.jpg',
      alt: 'Vista aérea dos prédios de São Paulo sob céu azul',
      position: '50% 88%',
    }
  },
  { 
    name: 'Uberaba', 
    uf: 'MG', 
    km: 380, 
    coords: [-47.9381, -19.7472], 
    labelPosition: 'top',
    photo: {
      src: '/images/banco/uberaba.jpg',
      alt: 'Vista aérea dos prédios de Uberaba sob céu azul',
      position: '50% 88%',
    }
  },
]

/**
 * Enquadramentos do mapa. No desktop sobra largura, então a moldura mostra
 * bastante do país em volta; no mobile, quase quadrado, esse mesmo recorte
 * espremeria as cidades num punhado de pixels — daí um recorte mais fechado
 * na região atendida. [[oeste, sul], [leste, norte]]
 */
export const rotasEnquadramento = {
  desktop: [
    [-53.2, -26.0],
    [-40.2, -17.3],
  ] as [[number, number], [number, number]],
  mobile: [
    [-48.6, -24.1],
    [-43.2, -19.2],
  ] as [[number, number], [number, number]],
}
