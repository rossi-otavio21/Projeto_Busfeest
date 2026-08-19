'use client'

import { motion } from 'framer-motion'
import { ChevronMark } from '@/components/brand/chevron'
import { fadeUp, staggerContainer, useReveal } from '@/lib/motion'
import { whatsappLink } from '@/lib/site'
import { areasAtuacao, rotasBase, totalCidadesAtendidas } from './rotas-data'

const regioesStagger = staggerContainer(0.1)
const cidadesStagger = staggerContainer(0.03)

/**
 * Alcance operacional — a contraparte em texto do mapa logo acima.
 *
 * Deliberadamente NÃO é uma fileira de cards: com 22 cidades, o card de
 * rota (feito para meia dúzia de destinos com foto) viraria uma parede
 * uniforme, onde Alfenas pesa o mesmo que São Paulo. Aqui a hierarquia é
 * geográfica — três regiões, cada uma com sua densidade — e o que
 * diferencia uma cidade da outra é a prova ao lado do nome, não o tamanho
 * do quadro. Cidade sem prova confirmada aparece só com o nome.
 */
export function RotasCobertura() {
  const headerReveal = useReveal(fadeUp)
  const regioesReveal = useReveal(regioesStagger)

  return (
    <div className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
      <motion.div {...headerReveal} className="max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue">
          <span className="h-1.5 w-6 rounded-full bg-blue" />
          Onde a Busfeest atua
        </p>
        <h2 className="mt-4 text-balance text-3xl font-extrabold leading-[1.02] tracking-tight text-white md:text-4xl">
          {totalCidadesAtendidas} cidades já receberam{' '}
          <span className="editorial-accent text-blue">um ônibus nosso.</span>
        </h2>
        <p className="mt-4 text-base font-light leading-relaxed text-gray">
          Não é uma lista de onde gostaríamos de chegar — é onde a operação já
          rodou, de linha diária a excursão de fim de semana.
        </p>
      </motion.div>

      <motion.div {...regioesReveal} className="mt-12 space-y-10 md:space-y-12">
        {areasAtuacao.map((regiao) => (
          <motion.div
            key={regiao.id}
            variants={fadeUp}
            className="grid gap-5 border-t border-white/10 pt-8 md:grid-cols-12 md:gap-10"
          >
            <div className="md:col-span-4">
              <h3 className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
                {regiao.label}
              </h3>
              <p className="mt-2 max-w-xs text-sm font-light leading-relaxed text-gray">
                {regiao.resumo}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-blue">
                {regiao.cidades.length} cidades
              </p>
            </div>

            {/* Multi-coluna em vez de grid: as cidades com nota são mais altas
                que as sem, e num grid isso abre buracos na coluna vizinha
                (as linhas alinham entre si). Em coluna, o texto flui e a
                lista fecha. */}
            <motion.ul
              variants={cidadesStagger}
              className="gap-x-10 sm:columns-2 md:col-span-8"
            >
              {regiao.cidades.map((cidade) => (
                <motion.li key={cidade.name} variants={fadeUp} className="break-inside-avoid">
                  <a
                    href={whatsappLink(
                      `Olá! Quero um orçamento de transporte ${rotasBase.name} → ${cidade.name} com a Busfeest.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Orçar transporte de ${rotasBase.name} para ${cidade.name} pelo WhatsApp`}
                    className="group flex items-baseline gap-2.5 border-b border-white/5 py-2 transition-colors hover:border-blue/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                  >
                    <ChevronMark
                      className="h-3 w-3 shrink-0 translate-y-px text-blue/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-blue"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="text-base font-semibold tracking-tight text-white transition-colors group-hover:text-blue">
                        {cidade.name}
                      </span>
                      {cidade.nota && (
                        <span className="mt-0.5 block text-xs font-light leading-snug text-gray">
                          {cidade.nota}
                        </span>
                      )}
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
