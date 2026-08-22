/**
 * Fotos reais usadas nas seções principais. Fonte única — para trocar uma
 * foto (ex. quando as fotos definitivas chegarem), basta editar o caminho
 * aqui; nenhum componente precisa mudar.
 */
export const media = {
  /**
   * Fundo do Hero da home e do fechamento.
   *
   * Era /images/hero/busfeest-onibus-estrada.jpeg: um ônibus com a pintura
   * da SC Minas ocupando o centro do quadro, em brilho pleno, na primeira
   * dobra da home — a foto mais vista do site anunciava outra empresa.
   *
   * Esta é uma excursão real da Busfeest chegando ao destino, sem marca de
   * terceiro em lugar nenhum. Ainda não é o ideal: falta no projeto uma
   * foto horizontal de ônibus com a pintura da BUSFEEST em estrada. Quando
   * ela existir, é só trocar este caminho.
   */
  heroBackground: '/images/hero/busfeest-onibus-estrada.jpeg',
  /**
   * A Busfeest fretador contrata veículo de terceiro, então quase toda foto
   * de ônibus no acervo traz a pintura de outra operadora (SC Minas, Dozza,
   * ACM). A regra adotada: livery de terceiro não entra em Hero, foto de
   * seção nem card de serviço — só na galeria, que é acervo documental,
   * mostra a foto inteira e sem recorte.
   *
   * Estas duas são do ônibus azul que a Busfeest roda, sem marca de
   * ninguém no lugar da dela, e com o letreiro dizendo o que a seção diz.
   * (A foto anterior, /images/sobre/busfeest-embarque-grupo.jpg, segue no
   * projeto: bom embarque de delegação, mas o teto do ônibus traz a pintura
   * da SC Minas e não havia recorte que a tirasse sem estourar o zoom.)
   */
  aboutPhoto: '/images/viagens/busfeest-embarque-cine-boa-viagem.jpg',
  historiaPhoto: '/images/viagens/busfeest-embarque-cine-turismo.jpg',
  finalCtaBackground: '/images/eventos/busfeest-excursao-brodowski-grupo.jpg',
  /** Grupo real (alunos + van) no evento Unigames 2026 — recorte via object-position. */
  eventPhoto: '/images/eventos/busfeest-unigames-embarque.jpg',
  /**
   * Foto de humanização do Contato. Ainda não existe uma foto do
   * fundador/equipe no projeto — usa a mesma foto real de grupo+van até
   * que uma foto de equipe seja enviada (só trocar este caminho).
   */
  
  photoInstagram: '/images/instagram/perfil.jpg',
  /**
   * Coluna fotográfica da página de Contato.
   *
   * Era /images/instagram/contato.jpg — o post "o transporte que cabe no
   * seu orçamento", com a carteira. Arte de feed quadrada, não fotografia:
   * para preencher uma coluna de 36rem ela vinha com `scale(2.2)`, o que
   * cortava fora o título e o logo do próprio post e deixava só um pedaço
   * ampliado (e borrado) da carteira. O post continua no projeto e segue
   * ótimo no lugar dele, inteiro, num card — só não como foto de fundo.
   *
   * No lugar, gente de verdade: grupo real da Busfeest ouvindo o guia numa
   * parada de excursão.
   */
  contactPhoto: '/images/eventos/busfeest-excursao-parada-guia.jpg',
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
  /**
   * Leva do WhatsApp (11/08/2026) — fotos reais de ônibus contratados/parceiros
   * (Dozza, SC Minas, Busscar, ACM), sem grupo em foco. Organizadas por
   * operadora/ângulo para dar opções de recorte em cards e bandas de foto.
   */
  frota: {
    scMinasLateral: '/images/frota/busfeest-onibus-scminas-lateral.jpg',
    scMinasFrente: '/images/frota/busfeest-onibus-scminas-frente.jpg',
    busscarFrente: '/images/frota/busfeest-onibus-busscar-frente.jpg',
    busscarPortaoEscola: '/images/frota/busfeest-onibus-busscar-portao-escola.jpg',
    /** Rodoviário executivo (Marcopolo Paradiso 1200, Wi-Fi, ar) — ótima pra "conforto"/fretamento premium. */
    executivoAcm: '/images/frota/busfeest-onibus-executivo-acm.jpg',
  },
  /**
   * Embarques e cenas de rua reais — grupo + ônibus juntos, mesma leva do
   * WhatsApp acima.
   */
  viagens: {
    embarqueAvenida: '/images/viagens/busfeest-embarque-avenida.jpg',
    embarqueGramadoOnibus: '/images/viagens/busfeest-embarque-gramado-onibus.jpg',
    embarqueGramadoGuardaChuva: '/images/viagens/busfeest-embarque-gramado-guarda-chuva.jpg',
    embarqueGramadoGrupo: '/images/viagens/busfeest-embarque-gramado-grupo.jpg',
    onibusDozzaParado: '/images/viagens/busfeest-onibus-dozza-parado.jpg',
    onibusRuaEstreita: '/images/viagens/busfeest-onibus-rua-estreita.jpg',
    /** Letreiro do ônibus mostrando "BOA VIAGEM!!" — ótima pra fechamento/CTA. */
    embarqueCineBoaViagem: '/images/viagens/busfeest-embarque-cine-boa-viagem.jpg',
    embarqueCineTurismo: '/images/viagens/busfeest-embarque-cine-turismo.jpg',
  },
  /**
   * Excursões, festas/shows e embarques noturnos — mesma leva do WhatsApp.
   * Nomeados pelo que aparece na foto (evento/turma), não por cliente.
   */
  eventos: {
    vanFestaChegadaNoite: '/images/eventos/busfeest-van-festa-chegada-noite.jpg',
    vanFestaAbracoNoite: '/images/eventos/busfeest-van-festa-abraco-noite.jpg',
    excursaoFestaJuninaExplicacao: '/images/eventos/busfeest-excursao-festa-junina-explicacao.jpg',
    excursaoFestaJuninaGrupo: '/images/eventos/busfeest-excursao-festa-junina-grupo.jpg',
    excursaoParadaGuia: '/images/eventos/busfeest-excursao-parada-guia.jpg',
    /** Grupo no letreiro "EU AMO BRODOWSKI", igreja ao fundo — melhor foto de destino da leva. */
    excursaoBrodowskiGrupo: '/images/eventos/busfeest-excursao-brodowski-grupo.jpg',
    excursaoGuiaParque: '/images/eventos/busfeest-excursao-guia-parque.jpg',
    embarqueNoturnoBoaVirgem: '/images/eventos/busfeest-embarque-noturno-boavirgem.jpg',
    embarqueMedicinaUnifalFila: '/images/eventos/busfeest-embarque-medicina-unifal-fila.jpg',
    embarqueMedicinaUnifalOnibus: '/images/eventos/busfeest-embarque-medicina-unifal-onibus.jpg',
  },
  /** Grupo corporativo (equipe) posando junto ao ônibus SC Minas — mesma leva do WhatsApp. */
  corporativo: {
    equipeScMinasGrupo: '/images/corporativo/busfeest-equipe-scminas-grupo.jpg',
    equipeScMinasGrupo2: '/images/corporativo/busfeest-equipe-scminas-grupo-2.jpg',
  },
} as const
