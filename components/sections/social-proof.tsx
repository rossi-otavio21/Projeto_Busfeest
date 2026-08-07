import { InstagramGlyph } from '@/components/brand/icons'
import { ChevronMark } from '@/components/brand/chevron'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

// Segmentos e ocasiões que a Busfeest já atendeu (prova social real).
const audiences = [
  'Atléticas e turmas de faculdade',
  'Igrejas e grupos religiosos',
  'Empresas e eventos corporativos',
  'Famílias e excursões',
]

export function SocialProof() {
  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue">
              Quem já viajou com a gente
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
              Confiança de quem move grupos pelo sul de Minas
            </h2>
            <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">
              De excursões de atléticas a eventos de igrejas e empresas: já
              rodamos com todo tipo de grupo, construindo parcerias locais em
              cada cidade que atendemos.
            </p>

            <Button
              variant="cta-dark"
              size="cta-md"
              className="mt-8"
              nativeButton={false}
              render={
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <InstagramGlyph />
              Ver eventos no {site.instagram.handle}
            </Button>
          </div>

          <ul className="grid gap-3">
            {audiences.map((audience) => (
              <li
                key={audience}
                className="flex items-center gap-4 rounded-xl bg-white px-5 py-4"
              >
                <ChevronMark className="h-4 w-4 shrink-0 text-blue" />
                <span className="font-medium text-navy">{audience}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
