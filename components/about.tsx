import Image from 'next/image'
import { RoadDivider } from '@/components/brand/chevron'

export function About() {
  return (
    <section id="sobre" className="bg-white py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-blue">
            Sobre a Busfeest
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Quase 6 anos rodando o sul de Minas com preço justo
          </h2>
          <RoadDivider className="mt-6 max-w-24" />
          <div className="mt-6 space-y-4 text-lg font-light leading-relaxed text-muted-foreground">
            <p>
              A Busfeest nasceu para tornar a viagem em grupo acessível: um
              transporte low cost pensado para quem não quer pagar caro, mas
              também não abre mão de chegar bem e com segurança.
            </p>
            <p>
              Em quase seis anos de estrada, viemos expandindo nossa atuação por
              todo o sul de Minas Gerais, atendendo turmas de faculdade,
              atléticas, igrejas, empresas e famílias em excursões, eventos e
              translados.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/group-travel.png"
              alt="Grupo de passageiros embarcando animados em um ônibus da Busfeest para uma excursão"
              width={720}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Detalhe geométrico da marca no canto */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -left-4 h-20 w-20 bg-blue [clip-path:polygon(0_0,100%_0,100%_100%)] md:h-28 md:w-28"
          />
        </div>
      </div>
    </section>
  )
}
