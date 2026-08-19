'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { fadeUp, staggerContainer, slideFromLeft, slideFromRight, useReveal } from '@/lib/motion'
import { whatsappLink } from '@/lib/site'

// Depoimentos reais recebidos de grupos que já viajaram com a Busfeest —
// não são inventados: vieram de feedbacks publicados pelas próprias
// atléticas parceiras nas redes. `org` é a marca/atlética citada no
// depoimento (nem toda atlética do mural abaixo tem uma citação aqui).
const quotes = [
  {
    quote:
      'Queremos agradecer à empresa Busfeest pela excelente prestação de serviço durante o transporte dos atletas. O transporte estava muito bem limpo e conservado, e a pontualidade no embarque mostrou organização e responsabilidade. Também gostaria de ressaltar a educação e o profissionalismo do motorista, atencioso e cordial durante todo o percurso.',
    org: 'A.A.A.E.M.S.',
    detail: 'Atlética de Medicina — Alfenas/MG',
  },
  {
    quote:
      'Amigo, não tenho nada a reclamar do transporte — os motoristas foram super legais e compreensivos, não atrasaram e ainda me ajudaram com várias dicas.',
    org: 'Atlética Muquirana',
    detail: '@aaamuquirana — Alfenas/MG',
  },
  {
    quote:
      'Estamos satisfeitos com o serviço que nos foi oferecido. Agradecemos o bom atendimento e consideramos a experiência geral garantida.',
    org: 'Grupo parceiro',
    detail: '@ldupocos',
  },
]

/**
 * Mural de atléticas parceiras — independente das citações acima (nem toda
 * atlética com logo tem depoimento em texto, e vice-versa). Sem `logo`, o
 * card cai para o nome em destaque tipográfico — mesmo padrão dos cards de
 * rota sem foto: funciona como estado permanente, não só "enquanto não
 * chega a arte".
 */
const parceiros = [
  {
    name: 'A.A.A.E.M.S.',
    role: 'Medicina — Alfenas/MG',
    logo: { src: '/images/logos/aaaems.svg', alt: 'Logo da A.A.A.E.M.S., atlética de Medicina de Alfenas' },
  },
  {
    name: 'Atlética Muquirana',
    role: 'ICSA — Alfenas/MG',
    logo: { src: '/images/logos/atletica-muquirana.svg', alt: 'Logo da Atlética Muquirana, ICSA Alfenas' },
  },
  {
    name: 'A.A.U.L.D.U.',
    role: 'Engenharias — UNIFAL',
    logo: { src: '/images/logos/aauldu.svg', alt: 'Logo da A.A.U.L.D.U., atlética de Engenharias da UNIFAL' },
  },
  {
    name: 'AAAMFA',
    role: 'Medicina Federal — Alfenas/MG',
    logo: { src: '/images/logos/aaamfa.svg', alt: 'Logo da AAAMFA, atlética de Medicina Federal de Alfenas' },
  },
  {
    name: 'A.A.A. IFSULDEMINAS',
    role: 'Educação Física — Muzambinho/MG',
    logo: { src: '/images/logos/aaa-ifsuldeminas-muzambinho.svg', alt: 'Logo da A.A.A. IFSULDEMINAS, atlética de Educação Física de Muzambinho' },
  },
  {
    name: 'AAUEC',
    role: 'CEFET-MG — Varginha/MG',
    logo: { src: '/images/logos/aauec.svg', alt: 'Logo da AAUEC, atlética do CEFET-MG de Varginha' },
  },
]

const parceriaMessage =
  'Olá! Somos uma atlética e queremos saber sobre parceria com a Busfeest.'

const logosStagger = staggerContainer(0.06)

export function Testimonials() {
  const eyebrowReveal = useReveal(fadeUp)
  const revealLeft = useReveal(slideFromLeft)
  const revealRight = useReveal(slideFromRight)
  const logosReveal = useReveal(logosStagger)

  return (
    <section className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div
          {...eyebrowReveal}
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue"
        >
          <span className="h-1.5 w-6 rounded-full bg-blue" />
          <span>Quem já rodou com a gente</span>
        </motion.div>

        <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
          {quotes.map((item, index) => {
            const reveal = index % 2 === 0 ? revealLeft : revealRight
            return (
              <motion.figure
                key={item.org}
                {...reveal}
                className="grid gap-3 py-8 md:grid-cols-[1fr_auto] md:items-start md:gap-10"
              >
                <blockquote className="editorial-accent text-pretty text-lg leading-relaxed text-gray md:text-xl">
                  “{item.quote}”
                </blockquote>
                {/* Nome da atlética em destaque tipográfico — faz as vezes de
                    logo até termos os arquivos de imagem de verdade. */}
                <figcaption className="text-sm md:text-right">
                  <span className="block text-lg font-extrabold tracking-tight text-blue md:text-xl">
                    {item.org}
                  </span>
                  <span className="mt-1 block text-gray">{item.detail}</span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>

        {/* Mural das atléticas — as mesmas marcas dos depoimentos acima,
            em destaque tipográfico (vira logo de verdade quando a arte
            chegar), fechando com o convite pra próxima parceria. */}
        <motion.div
          {...logosReveal}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {parceiros.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors duration-300 hover:border-blue/40"
            >
              {item.logo ? (
                <Image
                  src={item.logo.src}
                  alt={item.logo.alt}
                  width={120}
                  height={120}
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <span className="text-lg font-extrabold tracking-tight text-white">{item.name}</span>
              )}
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray">
                {item.role}
              </span>
            </motion.div>
          ))}

          <motion.a
            variants={fadeUp}
            href={whatsappLink(parceriaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-blue/30 p-5 text-center transition-colors duration-300 hover:border-blue/60 hover:bg-blue/[0.05] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue/40 text-blue transition-transform duration-300 group-hover:scale-110">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-white">Sua atlética aqui</span>
          </motion.a>
        </motion.div>

        <p className="mt-10 max-w-3xl text-sm font-light leading-relaxed text-gray">
          Só para a A.A.A.E.M.S. foram{' '}
          <strong className="font-semibold text-white">123 passageiros</strong> em
          uma única operação. No Treme, a Busfeest colocou{' '}
          <strong className="font-semibold text-white">14 vans</strong> no
          transporte interno — 219 pessoas por dia — mais{' '}
          <strong className="font-semibold text-white">2 ônibus</strong> na rota
          Alfenas × Pouso Alegre, com 92 passageiros.
        </p>
      </div>
    </section>
  )
}
