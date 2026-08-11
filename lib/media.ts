/**
 * Fotos reais usadas nas seções principais. Fonte única — para trocar uma
 * foto (ex. quando as fotos definitivas chegarem), basta editar o caminho
 * aqui; nenhum componente precisa mudar.
 */
export const media = {
  heroBackground: '/images/hero/busfeest-onibus-estrada.png',
  aboutPhoto: '/images/sobre/busfeest-embarque-grupo.png',
  finalCtaBackground: '/images/hero/busfeest-onibus-estrada.png',
  /** Grupo real (alunos + van) no evento Unigames 2026 — recorte via object-position. */
  eventPhoto: '/images/eventos/busfeest-unigames-embarque.jpg',
  /**
   * Foto de humanização do Contato. Ainda não existe uma foto do
   * fundador/equipe no projeto — usa a mesma foto real de grupo+van até
   * que uma foto de equipe seja enviada (só trocar este caminho).
   */
  contactPhoto: '/images/eventos/busfeest-unigames-embarque.jpg',
  /**
   * Foto do fundador no card "Quem toca a Busfeest" (Sobre). Placeholder
   * até chegar a foto de verdade — só trocar este caminho.
   */
  founderPhoto: '/images/eventos/busfeest-unigames-embarque.jpg',
  /** Ônibus real da frota (frente, escola ao fundo) — recorte central já remove o selo fino do topo. */
  frotaOnibusEscola: '/images/frota/busfeest-onibus-frente-escola.jpg',
  /** Embarque real de estudantes (Carmo do Rio Claro → Alfenas) — recorte central remove as faixas de texto. */
  embarqueEstudantes: '/images/viagens/busfeest-embarque-estudantes-carmo.jpg',
  /** Dois ônibus reais contratados para a rota Alfenas × Juiz de Fora. */
  onibusAlfenasJuizDeFora: '/images/viagens/busfeest-onibus-alfenas-juizdefora.jpg',
  /** Posts reais do Instagram — usados como cards, não como fundo. */
  posts: {
    experiencias: '/images/originais/busfeest-post-experiencias.jpg',
    unigamesTrofeu: '/images/originais/busfeest-post-unigames-trofeu.jpg',
    machadoAlfenas: '/images/originais/busfeest-post-machado-alfenas.jpg',
    treme: '/images/originais/busfeest-post-treme-fotos.jpg',
  },
} as const
