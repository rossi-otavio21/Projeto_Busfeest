'use client'

import Image from 'next/image'
import { ArrowRight, MapPin, Building2, Bus, ShieldCheck } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity } from '@fortawesome/free-solid-svg-icons'
import { WhatsappGlyph } from '@/components/brand/icons'
import { whatsappLink } from '@/lib/site'
import { RotasCobertura } from './rotas-cobertura'
import { RotasMapa } from './rotas-mapa'
import { rotasBase, rotasDestinos } from './rotas-data'

export function RotasMap() {
  const whatsapp = whatsappLink(
    'Olá! Gostaria de saber sobre as rotas atendidas pela Busfeest.',
  )
  return (
    <>
      {/* Rede e cobertura formam a parte operacional: fundo escuro contínuo,
          para o mapa e as rotas serem lidos como sistema, não como cards soltos. */}
      <section className="bg-navy pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Detalhe discreto de estrada tracejada azul */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue">
              <span className="h-1.5 w-6 rounded-full road-dashes" />
              <span>Rede de Rotas & Destinos</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-white md:text-6xl lg:text-7xl">
              Conectando o Sul de Minas{' '}
              <span className="text-blue">e além</span>
            </h1>

            <p className="mt-6 text-lg font-normal leading-relaxed text-gray md:text-xl">
              Partindo de nossa base em Alfenas, levamos grupos e passageiros com conforto e segurança. Explore nossa malha de atendimento entre polos universitários, capitais e cidades do interior de MG e SP.
            </p>

            {/* Linha de estrada tracejada decorativa na horizontal abaixo do texto */}
            <div className="mx-auto mt-8 h-1 w-24 rounded-full road-dashes opacity-80" />
          </div>

          {/* Não usar reveals de viewport nesta página: ao navegar de volta,
              conteúdo operacional precisa estar disponível imediatamente. */}
          <div className="mt-12 md:mt-16">
            <RotasMapa />
          </div>

          {/* 3. Faixa branca com 3 dados chave após o mapa */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-700/45 p-6 transition-colors duration-300 hover:border-blue/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue/15 text-blue">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-white">Base em Alfenas, MG</p>
                <p className="mt-0.5 text-xs font-normal text-gray">
                  Ponto de partida estratégico com pronto atendimento regional.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-700/45 p-6 transition-colors duration-300 hover:border-blue/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue/15 text-blue">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-white">22 cidades atendidas</p>
                <p className="mt-0.5 text-xs font-normal text-gray">
                  Malha ativa cobrindo os principais eixos de Minas Gerais e São Paulo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-navy-700/45 p-6 transition-colors duration-300 hover:border-blue/60">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue/15 text-blue">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-white">Rotas sob medida</p>
                <p className="mt-0.5 text-xs font-normal text-gray">
                  Itinerários flexíveis para excursões, eventos e grupos empresariais.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Lista "Onde a Busfeest atua" em fundo cinza muito claro */}
          <RotasCobertura />
        </div>
      </section>

      {/* A superfície clara entra só aqui, para as fotos dos destinos respirarem. */}
      <section className="border-t border-white/10 bg-gray-tint pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          {/* Destinos mais pedidos — cards brancos com hover suave */}
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-blue">
                  <span className="h-1.5 w-6 rounded-full bg-blue" />
                  Trajetos em Destaque
                </p>

                <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-navy md:text-4xl">
                  Os destinos <span className="text-blue">mais pedidos</span>
                </h2>
              </div>

              <p className="max-w-md text-sm font-normal text-muted-foreground">
                Clique para orçar diretamente seu trajeto personalizado partindo de Alfenas com a Busfeest.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rotasDestinos.map((destino) => (
                <a
                  key={destino.name}
                  href={whatsappLink(
                    `Olá! Quero um orçamento da rota ${rotasBase.name} → ${destino.name} com a Busfeest.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Orçar a rota ${rotasBase.name} para ${destino.name} pelo WhatsApp`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  {/* Foto do destino */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
                    {destino.photo ? (
                      <Image
                        src={destino.photo.src}
                        alt={destino.photo.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        style={{ objectPosition: destino.photo.position }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center bg-slate-100"
                      >
                        <FontAwesomeIcon icon={faCity} className="h-9 w-9 text-navy/20" />
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-75 transition-opacity group-hover:opacity-85"
                    />

                    <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-navy/90 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                      <MapPin className="h-3 w-3 text-blue" aria-hidden="true" />
                      {destino.uf}
                    </span>

                    <div className="absolute right-3.5 top-3.5 rounded-full bg-navy/60 p-2 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#25D366] group-hover:text-navy-deep">
                      <WhatsappGlyph className="h-4 w-4 drop-shadow-md" />
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {rotasBase.name}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-blue transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-navy transition-colors group-hover:text-blue">
                      {destino.name}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-navy/5 pt-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-navy/10 bg-slate-100 px-3 py-1 text-[0.72rem] font-bold text-navy">
                        ≈ {destino.km} km rodoviários
                      </span>
                      <span className="text-xs font-bold text-blue transition-colors group-hover:underline">
                        Orçar rota
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Final: O ÚNICO bloco navy escuro da página */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-navy p-8 sm:p-12 shadow-2xl md:flex md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue">
                <ShieldCheck className="h-4 w-4" />
                Atendimento Personalizado
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Seu destino não está na lista?
              </h2>
              <p className="mt-3 text-base font-light leading-relaxed text-gray">
                Fazemos conexões com aeroportos regionais (Guarulhos, Viracopos, Confins, Ribeirão Preto) e montamos <strong className="font-semibold text-white">rotas sob medida</strong> para o seu grupo com orçamento rápido.
              </p>
            </div>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex shrink-0 items-center gap-3 rounded-full bg-[#25D366] px-8 py-4.5 text-sm font-extrabold uppercase tracking-wider text-navy-deep shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgba(37,211,102,0.85)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue md:mt-0"
            >
              <WhatsappGlyph className="h-6 w-6" />
              Solicitar Rota no WhatsApp
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
