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
 * Rede completa de atuação — as cidades onde a Busfeest já rodou de fato.
 *
 * Separada de `rotasDestinos` de propósito: aquela lista são os quatro
 * destinos com foto e distância aferida, que viram card e ganham arco
 * animado no mapa. Esta aqui responde outra pergunta ("até onde vocês
 * chegam?") e por isso não carrega km — nenhuma distância é estimada no
 * olho. `nota` só existe quando há prova concreta da operação: número de
 * veículos, de passageiros ou o evento em que a Busfeest foi a excursão
 * oficial. Sem fonte, a cidade entra sem nota — nunca com um número
 * inventado para preencher.
 */
export interface CidadeAtendida {
  name: string
  coords: [number, number]
  /** Prova da operação naquela cidade. Só com fonte; caso contrário, ausente. */
  nota?: string
  /**
   * Rótulo no mapa, e de que lado do pino ele fica. Reservado às cidades da
   * borda da malha — as que mostram até onde a operação chega. O miolo
   * colado em Alfenas (Machado, Varginha, Poços de Caldas...) fica sem
   * rótulo de propósito: os nomes se sobrepõem em poucos pixels e apagam
   * justamente a leitura de que ali a malha é densa.
   */
  label?: 'top' | 'bottom'
}

export interface RegiaoAtuacao {
  id: string
  label: string
  /** Uma linha sobre o papel daquela região na operação. */
  resumo: string
  cidades: CidadeAtendida[]
}

export const areasAtuacao: RegiaoAtuacao[] = [
  {
    id: 'sul-de-minas',
    label: 'Sul de Minas',
    resumo: 'O quintal de casa: onde a Busfeest opera com mais frequência.',
    cidades: [
      { name: 'Alfenas', coords: [-45.9477, -21.4256], nota: 'Base da operação' },
      { name: 'Machado', coords: [-45.92, -21.6742], nota: 'Linha fixa diária' },
      { name: 'Carvalhópolis', coords: [-45.8408, -21.7772], nota: 'Linha fixa · Festa do Peão' },
      { name: 'Varginha', coords: [-45.43, -21.5514] },
      { name: 'Poços de Caldas', coords: [-46.5619, -21.7878] },
      { name: 'Pouso Alegre', coords: [-45.9364, -22.23], nota: 'Treme · 2 ônibus, 92 passageiros' },
      { name: 'Lavras', coords: [-44.9994, -21.245], nota: 'Arapuca · ExpoLavras — 6 ônibus' },
      { name: 'Lambari', coords: [-45.3506, -21.9758] },
      { name: 'Guaxupé', coords: [-46.7128, -21.305] },
      { name: 'Passos', coords: [-46.61, -20.7189] },
      { name: 'Campos Gerais', coords: [-45.7583, -21.235] },
      { name: 'Carmo do Rio Claro', coords: [-46.1153, -20.9739], nota: '128 estudantes em turismo pedagógico' },
    ],
  },
  {
    id: 'minas-gerais',
    label: 'Minas Gerais',
    resumo: 'Capital, Triângulo e Campo das Vertentes, saindo do Sul de Minas.',
    cidades: [
      { name: 'Belo Horizonte', coords: [-43.9345, -19.9167], label: 'top' },
      { name: 'Juiz de Fora', coords: [-43.3503, -21.7642], nota: '123 passageiros em uma só operação', label: 'bottom' },
      { name: 'São João del-Rei', coords: [-44.2619, -21.1356], nota: '5 excursões só em 2026', label: 'top' },
      { name: 'Uberaba', coords: [-47.9381, -19.7472] },
      { name: 'Uberlândia', coords: [-48.2772, -18.9186], label: 'top' },
    ],
  },
  {
    id: 'sao-paulo',
    label: 'São Paulo',
    resumo: 'Capital, polos universitários e destinos de excursão no interior paulista.',
    cidades: [
      { name: 'São Paulo', coords: [-46.6333, -23.5505], label: 'bottom' },
      { name: 'Campinas', coords: [-47.0626, -22.9056], nota: 'Unicamp', label: 'bottom' },
      { name: 'Ribeirão Preto', coords: [-47.8103, -21.1775], label: 'top' },
      { name: 'São Carlos', coords: [-47.8908, -22.0175], nota: 'Tusca', label: 'bottom' },
      { name: 'Brodowski', coords: [-47.6592, -20.9958], nota: 'Excursão de destino' },
    ],
  },
]

/** Todas as cidades atendidas, achatadas — usado pelos pinos do mapa. */
export const cidadesAtendidas: CidadeAtendida[] = areasAtuacao.flatMap(
  (regiao) => regiao.cidades,
)

/** Total exibido no cabeçalho da seção — nunca digitado à mão. */
export const totalCidadesAtendidas = cidadesAtendidas.length
