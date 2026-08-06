import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/site'

export function FinalCta() {
  const whatsapp = whatsappLink(
    'Olá! Quero fechar uma viagem com a Busfeest. Pode me passar um orçamento?',
  )

  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 md:py-28">
      {/* Grafismo de estrada tracejada em diagonal ao fundo */}
      <div
        aria-hidden="true"
        className="road-dashes pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 bg-blue/15 [clip-path:polygon(0_0,100%_0,100%_100%)]"
      />

      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-balance text-3xl font-bold leading-tight text-white md:text-5xl">
          O transporte que cabe no seu orçamento.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg font-light leading-relaxed text-gray">
          Conte pra gente para onde seu grupo vai. Respondemos rápido e sem
          burocracia, direto no WhatsApp.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-blue px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Orçar pelo WhatsApp
        </a>
      </div>
    </section>
  )
}
