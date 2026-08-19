'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { media } from '@/lib/media'

const listStagger = staggerContainer(0.12)

export function Highlights() {
  const listReveal = useReveal(listStagger)
  const routesReveal = useReveal(fadeUp)

  return (
    <section className="border-t border-navy/10 bg-white pt-24 md:pt-36">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-navy/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue">
              03 · PRÓXIMA ROTA
            </span>
            <h2 className="mt-3 text-balance text-3xl font-extrabold leading-[0.96] tracking-tight text-navy sm:text-5xl md:text-6xl">
              Escolha a sua <span className="editorial-accent text-blue">próxima rota.</span>
            </h2>
          </div>
          <p className="max-w-md text-base font-light text-muted-foreground">
            Três caminhos para o mesmo lugar: entrar numa viagem já montada, fretar o veículo inteiro para o seu grupo, ou ver até onde a gente chega.
          </p>
        </div>

        <motion.div {...listReveal} className="mt-16 space-y-20 pb-24 md:pb-32">
          {/* DESTAQUE 1: VIAGENS & EXCURSÕES (Combinação Editorial Foto + Texto) */}
          <motion.article variants={fadeUp} className="group relative grid gap-8 md:grid-cols-12 md:items-center">
            {/* 
              FOTO IDEAL (SUBSTITUIÇÃO FUTURA):
              - Assunto: Grupo de viajantes em destino turístico do Sul de Minas (Serra/Cachoeira)
              - Enquadramento: Horizontal 16:9 ou 4:3 com profundidade de campo
              - Iluminação: Dia ensolarado / luz natural
              - Prioridade: Foto real de excursão BUSFEEST
            */}
            <div className="relative min-h-[320px] md:min-h-[440px] md:col-span-7 overflow-hidden rounded-2xl bg-navy/5 shadow-xl">
              <Image
                src={media.posts.experiencias}
                alt="Van da Busfeest em viagem noturna para evento"
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-navy/90 backdrop-blur-md px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
                01 · Excursões & Eventos
              </span>
            </div>

            <div className="flex flex-col justify-center md:col-span-5 md:pl-4">
              <span className="text-xs font-bold text-blue uppercase tracking-widest">Viagens</span>
              <h3 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy tracking-tight group-hover:text-blue transition-colors">
                Viagens em Grupo & Excursões
              </h3>
              <p className="mt-4 text-base font-light text-muted-foreground leading-relaxed">
                Passeios organizados e roteiros para grupos no Sul de Minas e grandes eventos regionais. Preço justo do embarque ao retorno.
              </p>
              <Link
                href="/viagens"
                className="mt-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-navy group-hover:text-blue transition-colors"
              >
                Explorar viagens
                <ChevronMark className="h-4 w-4 text-blue transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.article>

          {/* DESTAQUE 2: FRETAMENTO SOB MEDIDA (Inversão Assimétrica) */}
          <motion.article variants={fadeUp} className="group relative grid gap-8 md:grid-cols-12 md:items-center">
            <div className="flex flex-col justify-center md:col-span-5 md:pr-4 order-2 md:order-1">
              <span className="text-xs font-bold text-blue uppercase tracking-widest">Fretamento</span>
              <h3 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy tracking-tight group-hover:text-blue transition-colors">
                Fretamento de Ônibus & Vans
              </h3>
              <p className="mt-4 text-base font-light text-muted-foreground leading-relaxed">
                Você diz a data, o ponto de embarque e quantas pessoas são. A gente escolhe o veículo do tamanho certo — van, executivo ou rodoviário — e o horário é o seu.
              </p>
              <Link
                href="/fretamento"
                className="mt-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-navy group-hover:text-blue transition-colors"
              >
                Conhecer opções de fretamento
                <ChevronMark className="h-4 w-4 text-blue transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 
              FOTO IDEAL (SUBSTITUIÇÃO FUTURA):
              - Assunto: Delegação universitária / atlética em frente à van da BUSFEEST
              - Enquadramento: Horizontal 16:9
              - Iluminação: Luz de dia limpa
              - Prioridade: Foto real de fretamento de delegação BUSFEEST (Unigames)
            */}
            <div className="relative min-h-[320px] md:min-h-[440px] md:col-span-7 overflow-hidden rounded-2xl bg-navy/5 shadow-xl order-1 md:order-2">
              <Image
                src={media.eventPhoto}
                alt="Grupo de alunos e delegação com a Busfeest no Unigames"
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: '50% 55%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-navy/90 backdrop-blur-md px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
                02 · Fretamento Exclusivo
              </span>
            </div>
          </motion.article>
        </motion.div>
      </div>

      {/* DESTAQUE 3: ROTAS & DESTINOS — sangra até a borda da seção (sem
          cantos arredondados, sem sombra) para que o branco de Highlights
          termine exatamente onde o navy começa, e o CTA final logo abaixo
          dê sequência ao mesmo navy sem corte — a página continua sendo
          uma única viagem, não um card flutuando sobre fundo branco. */}
      <motion.article {...routesReveal} className="group relative overflow-hidden bg-navy py-16 text-white md:py-24">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-12 md:items-center md:px-8">
          <div className="md:col-span-8">
            <span className="text-xs font-bold text-blue uppercase tracking-widest">Rede de conexão</span>
            <h3 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              De Alfenas a 22 cidades, entre Minas e São Paulo.
            </h3>
            <p className="mt-4 max-w-xl text-base font-light text-gray leading-relaxed">
              Capital, Triângulo, Campo das Vertentes e interior paulista — mais a malha densa aqui do lado, onde a gente roda toda semana.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              href="/rotas"
              className="inline-flex items-center gap-3 rounded-full bg-blue px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-deep"
            >
              Ver mapa de rotas
              <ChevronMark className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Grafismo de estrada ao fundo */}
        <div aria-hidden="true" className="road-dashes absolute inset-x-0 bottom-0 h-1 opacity-50" />
      </motion.article>
    </section>
  )
}

