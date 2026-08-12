import { media } from './media'

/**
 * Categorias e itens da galeria de viagens. Itens sem `src` renderizam um
 * slot vazio (aguardando foto); basta acrescentar `src`/`alt` a um item
 * (ou adicionar um novo objeto ao array) para a foto real aparecer — nenhuma
 * mudança em components/sections/gallery.tsx é necessária.
 */

export const galleryCategories = [
  'Excursões & Turmas',
  'Festas & Shows',
  'Corporativo'
] as const

export type GalleryCategory = (typeof galleryCategories)[number]

export type GalleryTileSize = 'sm' | 'md' | 'tall' | 'lg' | 'pano'

export interface GalleryItem {
  id: string
  category: GalleryCategory
  size: GalleryTileSize
  /** Caminho da foto real (ex. /images/gallery/arquivo.jpg). Ausente = slot vazio. */
  src?: string
  alt?: string
  /** Marca o tile como um post real do Instagram (recebe moldura de "post", não de foto solta). */
  isPost?: boolean
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    category: 'Excursões & Turmas',
    size: 'pano',
    src: media.posts.experiencias,
    alt: 'Post do Instagram da Busfeest: van da empresa em viagem noturna para o destino Secret Hut',
    isPost: true,
  },
  {
    id: 'g2',
    category: 'Festas & Shows',
    size: 'tall',
    src: media.posts.treme,
    alt: 'Post do Instagram da Busfeest: torcedores e ônibus a caminho do jogo do Pouso Alegre Futebol Clube (TREME)',
    isPost: true,
  },
  {
    id: 'g3',
    category: 'Excursões & Turmas',
    size: 'lg',
    src: media.posts.unigamesTrofeu,
    alt: 'Post do Instagram da Busfeest: atlética Muquirana comemorando com troféu no Unigames 2026',
    isPost: true,
  },
  {
    id: 'g4',
    category: 'Corporativo',
    size: 'sm',
    src: media.corporativo.equipeScMinasGrupo,
    alt: 'Equipe reunida e sorrindo ao lado do ônibus SC Minas contratado para o transporte do grupo',
  },
  {
    id: 'g6',
    category: 'Festas & Shows',
    size: 'sm',
    src: media.eventos.vanFestaAbracoNoite,
    alt: 'Passageiros se abraçando à noite no embarque de volta de uma festa',
  },
  {
    id: 'g7',
    category: 'Corporativo',
    size: 'md',
    src: media.posts.machadoAlfenas,
    alt: 'Post do Instagram da Busfeest: passageiros comemorando o transporte de trabalhadores e estudantes entre Machado e Alfenas',
    isPost: true,
  },
  {
    id: 'g9',
    category: 'Excursões & Turmas',
    size: 'md',
    src: media.eventos.excursaoBrodowskiGrupo,
    alt: 'Turma de excursão posando no letreiro "Eu amo Brodowski", com a igreja matriz ao fundo',
  },
  {
    id: 'g10',
    category: 'Festas & Shows',
    size: 'sm',
    src: media.eventos.embarqueNoturnoBoaVirgem,
    alt: 'Embarque noturno de volta de show, com o letreiro do ônibus mostrando o destino "Boa Virgem"',
  },
]
