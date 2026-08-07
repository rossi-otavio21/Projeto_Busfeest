/**
 * Categorias e itens da galeria de viagens. Sem fotos reais ainda — os
 * itens carregam só categoria/tamanho do tile; o componente renderiza um
 * placeholder visual até as fotos reais serem adicionadas.
 */

export const galleryCategories = [
  'Excursões & Turmas',
  'Festas & Shows',
  'Corporativo',
  'Famílias & Igrejas',
] as const

export type GalleryCategory = (typeof galleryCategories)[number]

export type GalleryTileSize = 'sm' | 'md' | 'tall' | 'lg'

export interface GalleryItem {
  id: string
  category: GalleryCategory
  size: GalleryTileSize
}

export const galleryItems: GalleryItem[] = [
  { id: 'g1', category: 'Excursões & Turmas', size: 'lg' },
  { id: 'g2', category: 'Festas & Shows', size: 'md' },
  { id: 'g3', category: 'Corporativo', size: 'sm' },
  { id: 'g4', category: 'Famílias & Igrejas', size: 'tall' },
  { id: 'g5', category: 'Excursões & Turmas', size: 'sm' },
  { id: 'g6', category: 'Festas & Shows', size: 'sm' },
  { id: 'g7', category: 'Corporativo', size: 'md' },
  { id: 'g8', category: 'Famílias & Igrejas', size: 'sm' },
  { id: 'g9', category: 'Excursões & Turmas', size: 'md' },
  { id: 'g10', category: 'Festas & Shows', size: 'tall' },
]
