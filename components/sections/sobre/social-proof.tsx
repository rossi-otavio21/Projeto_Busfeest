'use client'

import { motion, type Variants } from 'framer-motion'
import { InstagramGlyph } from '@/components/brand/icons'
import { MotionButton, ctaTapSpring, fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { site } from '@/lib/site'

/**
 * Eventos em que a Busfeest foi a excursão oficial.
 *
 * Fonte única: o post "EVENTOS — fomos excursão oficial de vários eventos",
 * publicado pela própria Busfeest e arquivado em
 * /public/images/originais/busfeest-lista-eventos.jpg. Nada aqui foi
 * deduzido — se um evento não está naquele post, não está nesta lista.
 *
 * `detail` só existe quando o número tem fonte: os 6 ônibus da Arapuca e os
 * 2 ônibus / 92 passageiros do Treme vieram do próprio material da empresa.
 * Evento sem número confirmado aparece só com o nome.
 *
 * `size` distribui peso tipográfico — é mural, não tabela: os eventos de
 * operação maior aparecem maiores, como numa capa.
 */
const eventos = [
  { name: 'Unigames', detail: 'Jogos Universitários do Brasil', size: 'text-4xl md:text-5xl' },
  { name: 'Arapuca', detail: 'ExpoLavras · 6 ônibus', size: 'text-3xl md:text-[2.75rem]' },
  { name: 'Tusca', detail: 'São Carlos — SP', size: 'text-3xl md:text-[2.75rem]' },
  { name: 'Treme', detail: '2 ônibus · 92 passageiros', size: 'text-2xl md:text-4xl' },
  { name: 'Intermed', detail: null, size: 'text-2xl md:text-4xl' },
  { name: 'Bloquim', detail: '2024', size: 'text-xl md:text-3xl' },
  { name: 'Jumineiro', detail: null, size: 'text-xl md:text-3xl' },
  { name: 'Festa do Peão', detail: 'Carvalhópolis · 2024', size: 'text-xl md:text-3xl' },
]

/**
 * Empresas parceiras — do post "PARCERIAS" da própria Busfeest
 * (/public/images/originais/busfeest-lista-parcerias.jpg). Só entram nomes
 * que aparecem naquele material. As igrejas do mesmo post ficam sem nome
 * de propósito: a marca delas não foi liberada para o site.
 */
const empresas = ['LS Tractor', 'Ultranova']

const clusterStagger = staggerContainer(0.06)

const wordPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export function SocialProof() {
  const textReveal = useReveal(fadeUp)
  const clusterReveal = useReveal(clusterStagger)
  const rodapeReveal = useReveal(staggerContainer(0.08, 0.15))

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <motion.div {...textReveal} className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-ink">
            <span className="h-1.5 w-6 rounded-full bg-blue" />
            <span>Excursão oficial de</span>
          </div>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-navy md:text-4xl">
            Quando o evento é grande, alguém precisa colocar todo mundo lá
          </h2>
          <p className="mt-4 text-lg font-light leading-relaxed text-muted-foreground">
            Estes são os eventos em que a Busfeest foi a excursão oficial —
            responsável por levar e trazer o público inteiro, não um ônibus
            avulso.
          </p>
        </motion.div>

        {/* Mural, não lista: quem operou mais aparece maior. */}
        <motion.div
          {...clusterReveal}
          className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-9 md:gap-x-12"
        >
          {eventos.map((evento) => (
            <motion.div key={evento.name} variants={wordPop} className="max-w-full">
              <span
                className={`block font-extrabold leading-[0.95] tracking-tight text-navy ${evento.size}`}
              >
                {evento.name}
              </span>
              {evento.detail && (
                <span className="mt-1.5 block text-xs font-semibold uppercase tracking-wider text-blue-ink">
                  {evento.detail}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Fora dos eventos: quem contrata a Busfeest no dia a dia. */}
        <motion.div
          {...rodapeReveal}
          className="mt-14 grid gap-8 border-t border-navy/10 pt-10 md:grid-cols-2 md:gap-16"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-ink">
              Empresas
            </p>
            <ul className="mt-3 flex flex-wrap items-baseline">
              {empresas.map((empresa, index) => (
                <li key={empresa} className="flex items-baseline">
                  {index > 0 && (
                    <span aria-hidden="true" className="px-4 text-2xl text-blue-ink md:text-3xl">
                      ·
                    </span>
                  )}
                  <span className="text-2xl font-extrabold tracking-tight text-navy md:text-3xl">
                    {empresa}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-ink">
              E também
            </p>
            <p className="mt-3 text-base font-light leading-relaxed text-muted-foreground">
              Igrejas, escolas e grupos corporativos que preferem não aparecer
              — o transporte é o mesmo, com ou sem logo na parede.
            </p>
          </motion.div>
        </motion.div>

        <MotionButton
          variant="cta-dark"
          size="cta-md"
          className="mt-12"
          nativeButton={false}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={ctaTapSpring}
          render={
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" />
          }
        >
          <InstagramGlyph />
          Ver eventos no {site.instagram.handle}
        </MotionButton>
      </div>
    </section>
  )
}
