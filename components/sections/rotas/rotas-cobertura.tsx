'use client'

import { useState } from 'react'
import { ChevronMark } from '@/components/brand/chevron'
import { whatsappLink } from '@/lib/site'
import { areasAtuacao, rotasBase, totalCidadesAtendidas } from './rotas-data'
import { MapPin, ShieldCheck, ArrowUpRight, Building2 } from 'lucide-react'

export function RotasCobertura() {
  const [selectedRegiao, setSelectedRegiao] = useState<string | 'todos'>('todos')

  const filteredRegioes = selectedRegiao === 'todos'
    ? areasAtuacao
    : areasAtuacao.filter((r) => r.id === selectedRegiao)

  return (
    <div className="mt-16 rounded-3xl border border-white/10 bg-navy-deep p-6 sm:p-10 shadow-[0_28px_70px_-38px_rgba(0,0,0,0.8)] md:mt-20 md:p-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-bright">
            <span className="h-1.5 w-6 rounded-full bg-blue" />
            <span>Onde a Busfeest atua</span>
          </div>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white md:text-4xl lg:text-5xl">
            {totalCidadesAtendidas} cidades já receberam{' '}
            <span className="text-blue-bright">um ônibus nosso.</span>
          </h2>
          <p className="mt-3 text-base font-normal leading-relaxed text-gray">
            Operações reais realizadas com frota própria e suporte dedicado. De viagens universitárias diárias a excursões de longa distância.
          </p>
        </div>

        {/* Filtros de Região leves em fundo branco */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
          <button
            onClick={() => setSelectedRegiao('todos')}
            aria-pressed={selectedRegiao === 'todos'}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
              selectedRegiao === 'todos'
                ? 'bg-navy text-white shadow-xs'
                : 'text-gray hover:bg-white/10 hover:text-white'
            }`}
          >
            Todas ({totalCidadesAtendidas})
          </button>
          {areasAtuacao.map((regiao) => (
            <button
              key={regiao.id}
              onClick={() => setSelectedRegiao(regiao.id)}
              aria-pressed={selectedRegiao === regiao.id}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                selectedRegiao === regiao.id
                  ? 'bg-navy text-white shadow-xs'
                : 'text-gray hover:bg-white/10 hover:text-white'
              }`}
            >
              {regiao.label} ({regiao.cidades.length})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Regiões em blocos leves com divisórias suaves */}
      <div className="mt-12 space-y-12 md:space-y-14">
        {filteredRegioes.map((regiao) => (
          <div
            key={regiao.id}
            className="border-t border-white/10 pt-8"
          >
            <div className="grid gap-6 md:grid-cols-12 md:gap-10">
              {/* Resumo da Região */}
              <div className="border-b border-white/10 pb-6 md:col-span-4 md:border-b-0 md:border-r md:pb-0 md:pr-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-bright">
                  <Building2 className="h-4 w-4" />
                  Região Operacional
                </div>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  {regiao.label}
                </h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-gray">
                  {regiao.resumo}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-blue/10 px-3 py-1 text-xs font-bold text-blue-bright">
                    <MapPin className="h-3 w-3" />
                    {regiao.cidades.length} cidades ativas
                  </span>
                </div>
              </div>

              {/* Grid de Cidades em cartões leves brancos com hover em azul */}
              <ul className="grid gap-3 sm:grid-cols-2 md:col-span-8 lg:grid-cols-2">
                {regiao.cidades.map((cidade) => (
                  <li key={cidade.name}>
                    <a
                      href={whatsappLink(
                        `Olá! Quero um orçamento de transporte ${rotasBase.name} → ${cidade.name} com a Busfeest.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Orçar transporte de ${rotasBase.name} para ${cidade.name} pelo WhatsApp`}
                      className="group/cidade flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] p-3.5 transition-colors duration-200 hover:border-blue/70 hover:bg-white/[0.1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                    >
                      <div className="flex items-start gap-3 min-w-0 pr-2">
                        <ChevronMark
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-blue-bright transition-transform duration-200 group-hover/cidade:translate-x-0.5"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <span className="block text-base font-bold tracking-tight text-white transition-colors group-hover/cidade:text-blue-bright">
                            {cidade.name}
                          </span>
                          {cidade.nota ? (
                            <span className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-blue/10 px-2 py-0.5 text-[11px] font-semibold text-blue-bright">
                              <ShieldCheck className="h-3 w-3 shrink-0 text-blue-bright" />
                              {cidade.nota}
                            </span>
                          ) : (
                            <span className="text-xs font-normal text-gray/80">
                              Saindo de Alfenas
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gray transition-colors duration-200 group-hover/cidade:bg-blue group-hover/cidade:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
