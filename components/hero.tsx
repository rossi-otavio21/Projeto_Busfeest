import Image from 'next/image'
import { MessageCircle, MapPin } from 'lucide-react'
import { ChevronMark } from '@/components/brand/chevron'
import { whatsappLink } from '@/lib/site'

const stats = [
  { value: '+6', label: 'anos de estrada' },
  { value: '6', label: 'destinos atendidos' },
  { value: '100%', label: 'foco em grupos' },
]

export function Hero() {
  const whatsapp = whatsappLink(
    'Olá! Quero um orçamento de transporte com a Busfeest.',
  )

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-navy"
    >
      {/* Imagem de fundo: estrada no sul de Minas */}
      <Image
        src="/images/hero-bus.png"
        alt="Ônibus de viagem da Busfeest percorrendo uma estrada entre as montanhas do sul de Minas Gerais ao entardecer"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay navy p/ contraste do texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-36">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray">
            <MapPin className="h-3.5 w-3.5 text-blue" aria-hidden="true" />
            Turismo low cost · Sul de Minas Gerais
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl">
            O transporte que cabe no seu{' '}
            <span className="text-blue">orçamento.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray">
            Há quase 6 anos levando turmas, igrejas, empresas e famílias pelas
            estradas do sul de Minas. Viagens em grupo com preço justo, sem abrir
            mão da segurança.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Orçar pelo WhatsApp
            </a>
            <a
              href="#rotas"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              Ver rotas
              <ChevronMark className="h-4 w-4" />
            </a>
          </div>

          {/* Indicadores rápidos */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-white">{stat.value}</dd>
                <dd className="text-sm text-gray">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
