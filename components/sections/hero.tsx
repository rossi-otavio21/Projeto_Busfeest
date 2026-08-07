import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChevronMark } from '@/components/brand/chevron'
import { WhatsappCta } from '@/components/brand/whatsapp-cta'

const stats = [
  { value: '+6', label: 'anos de estrada' },
  { value: '6', label: 'destinos atendidos' },
  { value: '100%', label: 'foco em grupos' },
]

export function Hero() {
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
            <WhatsappCta message="Olá! Quero um orçamento de transporte com a Busfeest.">
              Orçar pelo WhatsApp
            </WhatsappCta>
            <Button
              variant="cta-outline"
              size="cta"
              nativeButton={false}
              render={<a href="#rotas" />}
            >
              Ver rotas
              <ChevronMark className="h-4 w-4" />
            </Button>
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
