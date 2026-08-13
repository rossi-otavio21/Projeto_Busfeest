'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { InstagramGlyph } from '@/components/brand/icons'
import { Letreiro } from '@/components/brand/letreiro'
import type { GalleryItem } from '@/lib/gallery'

/**
 * Visualização em tela cheia de uma foto da galeria.
 *
 * Usa o `<dialog>` nativo em vez de uma div sobreposta: o navegador entrega
 * de graça — e corretamente — a armadilha de foco, o Esc para fechar, o
 * resto da página inerte para leitores de tela e a devolução do foco ao
 * tile que abriu. Reimplementar isso à mão é onde a maioria dos lightboxes
 * quebra a acessibilidade.
 *
 * Contrapartida assumida: `close()` esconde o elemento na hora, então não há
 * animação de saída. Entrada animada, saída instantânea — que é a proporção
 * certa de qualquer jeito.
 */

interface GalleryLightboxProps {
  items: GalleryItem[]
  /** Índice dentro de `items`, ou `null` com o lightbox fechado. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function GalleryLightbox({ items, index, onClose, onNavigate }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = index !== null
  const item = isOpen ? items[index] : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  // O `<dialog>` modal não trava o scroll da página em todos os navegadores.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  const go = useCallback(
    (step: number) => {
      if (index === null || items.length === 0) return
      onNavigate((index + step + items.length) % items.length)
    },
    [index, items.length, onNavigate],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(1)
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(-1)
      }
    },
    [go],
  )

  return (
    <dialog
      ref={dialogRef}
      aria-label="Foto da galeria em tela cheia"
      // A descrição da foto é anunciada junto com a abertura, então quem usa
      // leitor de tela sabe o que está aberto sem ter que navegar até a legenda.
      aria-describedby="gallery-lightbox-caption"
      onClose={onClose}
      onKeyDown={handleKeyDown}
      // Um clique que acerta o próprio `<dialog>` (e não o conteúdo dentro
      // dele) é um clique no fundo — o gesto esperado para fechar.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overscroll-contain bg-transparent p-0 text-white backdrop:bg-navy-deep/95"
    >
      {item && (
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="text-xs font-semibold tabular-nums tracking-[0.2em] text-gray">
              {String((index ?? 0) + 1).padStart(2, '0')}
              <span className="mx-1.5 opacity-50">/</span>
              {String(items.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-gray transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar galeria</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <Image
              // Trocar a `key` a cada foto evita que o navegador mostre o
              // quadro anterior esticado enquanto a próxima decodifica.
              key={item.id}
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1280px) 1100px, 100vw"
              className="h-auto max-h-full w-auto max-w-full rounded-sm object-contain"
            />

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-navy-deep/70 text-gray backdrop-blur-sm transition-colors hover:bg-navy-deep hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:left-3"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Foto anterior</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-0 flex h-12 w-12 items-center justify-center rounded-full bg-navy-deep/70 text-gray backdrop-blur-sm transition-colors hover:bg-navy-deep hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:right-3"
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Próxima foto</span>
            </button>
          </div>

          <div className="shrink-0 px-4 py-4 sm:px-6 sm:py-5">
            <div className="mx-auto flex max-w-3xl flex-col items-start gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Letreiro size="md">{item.sign}</Letreiro>
                {item.isPost && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-gray">
                    <InstagramGlyph className="h-3 w-3" />
                    Post publicado
                  </span>
                )}
              </div>
              <p
                id="gallery-lightbox-caption"
                className="text-sm font-light leading-relaxed text-gray"
              >
                {item.alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
