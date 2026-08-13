import { media } from './media'

/**
 * Acervo da galeria de viagens — fotos reais dos embarques, excursões e
 * fretamentos já rodados, mais os posts publicados no Instagram.
 *
 * Cada item carrega as dimensões reais do arquivo: o masonry usa a proporção
 * nativa de cada foto (nada é recortado) e o navegador já reserva o espaço
 * antes do download, então a página não pula enquanto a galeria carrega.
 *
 * `sign` é o texto do letreiro — o painel de destino do ônibus. Em algumas
 * fotos ele aparece de verdade ("BOA VIAGEM!!", "TURISMO", "BOA VIRGEM",
 * "CARRO 01"); nessas, o rótulo repete o que está escrito no painel.
 *
 * Para acrescentar uma foto: adicione o caminho em lib/media.ts e um objeto
 * aqui. Nenhum componente precisa mudar.
 */

export const galleryCategories = [
  'Excursões',
  'Festas & Shows',
  'Fretamento & Escolas',
] as const

export type GalleryCategory = (typeof galleryCategories)[number]

export interface GalleryItem {
  id: string
  category: GalleryCategory
  src: string
  /** Dimensões reais do arquivo, em pixels. */
  width: number
  height: number
  /** Texto do letreiro: destino ou momento, curto o bastante para caber num painel. */
  sign: string
  alt: string
  /** Post publicado no Instagram (arte pronta), não fotografia solta. */
  isPost?: boolean
}

export const galleryItems: GalleryItem[] = [
  // — Excursões ————————————————————————————————————————————————
  {
    id: 'brodowski',
    category: 'Excursões',
    src: media.eventos.excursaoBrodowskiGrupo,
    width: 1280,
    height: 720,
    sign: 'Brodowski',
    alt: 'Turma inteira posando no letreiro "Eu amo Brodowski", com palmeiras e a igreja matriz branca ao fundo em dia de céu limpo',
  },
  {
    id: 'festa-junina-turma',
    category: 'Excursões',
    src: media.eventos.excursaoFestaJuninaGrupo,
    width: 1280,
    height: 720,
    sign: 'Festa junina',
    alt: 'Estudantes reunidos na quadra da praça sob varais de bandeirinhas verdes e amarelas, ouvindo o guia antes de começar o passeio',
  },
  {
    id: 'festa-junina-praca',
    category: 'Excursões',
    src: media.eventos.excursaoFestaJuninaExplicacao,
    width: 1280,
    height: 720,
    sign: 'Briefing na praça',
    alt: 'Guia explicando o roteiro do dia para o grupo em círculo na praça, com bandeirinhas juninas cobrindo toda a quadra',
  },
  {
    id: 'parada-centro',
    category: 'Excursões',
    src: media.eventos.excursaoParadaGuia,
    width: 720,
    height: 1280,
    sign: 'Parada no centro',
    alt: 'Grupo parado na calçada em frente a um casarão de telhas vermelhas enquanto o guia de chapéu passa as orientações da próxima parada',
  },
  {
    id: 'guia-parque',
    category: 'Excursões',
    src: media.eventos.excursaoGuiaParque,
    width: 720,
    height: 1280,
    sign: 'Roteiro guiado',
    alt: 'Guia de chapéu e mochila conduzindo a turma na sombra das árvores do parque, com os alunos lendo o roteiro impresso',
  },
  {
    id: 'medicina-fila',
    category: 'Excursões',
    src: media.eventos.embarqueMedicinaUnifalFila,
    width: 720,
    height: 1280,
    sign: 'Medicina Unifal',
    alt: 'Fila de estudantes de medicina com mochilas e bagagem ao longo do muro, esperando para embarcar no ônibus da SC Minas',
  },
  {
    id: 'medicina-carro-01',
    category: 'Excursões',
    src: media.eventos.embarqueMedicinaUnifalOnibus,
    width: 590,
    height: 1280,
    sign: 'Carro 01',
    alt: 'Frente do ônibus com o letreiro "Turismo" aceso e a placa "Carro 01" no para-brisa, cercado pelo grupo que embarca',
  },
  {
    id: 'ponto-da-praca',
    category: 'Excursões',
    src: media.viagens.embarqueAvenida,
    width: 720,
    height: 1280,
    sign: 'Ponto da praça',
    alt: 'Turma de estudantes reunida à sombra de uma árvore na praça, com a van e os ônibus enfileirados na avenida ao fundo',
  },
  {
    id: 'antes-de-embarcar',
    category: 'Excursões',
    src: media.viagens.embarqueGramadoOnibus,
    width: 720,
    height: 1280,
    sign: 'Antes de embarcar',
    alt: 'Passageiros conversando no gramado sob o guarda-sol amarelo, com o ônibus de turismo e a van estacionados lado a lado',
  },
  {
    id: 'dozza-turismo',
    category: 'Excursões',
    src: media.viagens.onibusDozzaParado,
    width: 720,
    height: 1280,
    sign: 'Dozza Turismo',
    alt: 'Ônibus de turismo com a porta aberta esperando o embarque, enquanto o grupo aguarda sentado na grama ao lado da van',
  },
  {
    id: 'post-experiencias',
    category: 'Excursões',
    src: media.posts.experiencias,
    width: 1254,
    height: 1254,
    sign: 'Experiências',
    alt: 'Post do Instagram da Busfeest sobre as experiências de viagem, com a van da empresa em traslado noturno',
    isPost: true,
  },
  {
    id: 'post-unigames',
    category: 'Excursões',
    src: media.posts.unigamesTrofeu,
    width: 1254,
    height: 1254,
    sign: 'Unigames 2026',
    alt: 'Post do Instagram da Busfeest com a atlética comemorando o troféu conquistado no Unigames 2026',
    isPost: true,
  },

  // — Festas & Shows ————————————————————————————————————————————
  {
    id: 'volta-da-festa',
    category: 'Festas & Shows',
    src: media.eventos.vanFestaAbracoNoite,
    width: 720,
    height: 1280,
    sign: 'Volta da festa',
    alt: 'Dois passageiros se abraçando na rua de madrugada, iluminados pelos faróis da van que espera para levar o grupo de volta',
  },
  {
    id: 'van-na-porta',
    category: 'Festas & Shows',
    src: media.eventos.vanFestaChegadaNoite,
    width: 720,
    height: 1280,
    sign: 'Van na porta',
    alt: 'Van da Busfeest parada na faixa de pedestres com os faróis acesos, buscando o grupo na porta da festa de madrugada',
  },
  {
    id: 'boa-virgem',
    category: 'Festas & Shows',
    src: media.eventos.embarqueNoturnoBoaVirgem,
    width: 719,
    height: 1280,
    sign: 'Boa Virgem',
    alt: 'Embarque à noite com o letreiro do ônibus mostrando o destino "Boa Virgem" e o motorista conferindo a lista na porta',
  },
  {
    id: 'post-treme',
    category: 'Festas & Shows',
    src: media.posts.treme,
    width: 1080,
    height: 1080,
    sign: 'Treme',
    alt: 'Post do Instagram da Busfeest com os torcedores e os ônibus fretados para o torneio Treme',
    isPost: true,
  },

  // — Fretamento & Escolas ——————————————————————————————————————
  {
    id: 'boa-viagem',
    category: 'Fretamento & Escolas',
    src: media.viagens.embarqueCineBoaViagem,
    width: 720,
    height: 1280,
    sign: 'Boa viagem!!',
    alt: 'Ônibus azul encostado na porta do cinema com o letreiro escrito "Boa viagem!!" e o motorista já no volante',
  },
  {
    id: 'turismo',
    category: 'Fretamento & Escolas',
    src: media.viagens.embarqueCineTurismo,
    width: 720,
    height: 1280,
    sign: 'Turismo',
    alt: 'Mesmo ônibus com o letreiro trocado para "Turismo", desembarcando estudantes na entrada do Cine A',
  },
  {
    id: 'porta-do-cinema',
    category: 'Fretamento & Escolas',
    src: media.viagens.onibusRuaEstreita,
    width: 720,
    height: 1280,
    sign: 'Porta do cinema',
    alt: 'Ônibus manobrando na rua estreita ao lado da calçada do cinema, com os passageiros descendo pela lateral',
  },
  {
    id: 'equipe-a-bordo',
    category: 'Fretamento & Escolas',
    src: media.corporativo.equipeScMinasGrupo,
    width: 1280,
    height: 960,
    sign: 'Equipe a bordo',
    alt: 'Equipe de doze pessoas posando sorrindo encostada na lateral do ônibus fretado para o transporte do grupo',
  },
  {
    id: 'executivo',
    category: 'Fretamento & Escolas',
    src: media.frota.executivoAcm,
    width: 960,
    height: 1280,
    sign: 'Executivo · Wi-Fi',
    alt: 'Ônibus rodoviário executivo Marcopolo Paradiso 1200 com selo de Wi-Fi a bordo, parado ao sol antes da viagem',
  },
  {
    id: 'post-carmo',
    category: 'Fretamento & Escolas',
    src: media.embarqueEstudantes,
    width: 1080,
    height: 1350,
    sign: 'Carmo do Rio Claro',
    alt: 'Post do Instagram da Busfeest sobre o turismo pedagógico que levou 128 estudantes de Carmo do Rio Claro a Alfenas',
    isPost: true,
  },
  {
    id: 'post-machado',
    category: 'Fretamento & Escolas',
    src: media.posts.machadoAlfenas,
    width: 1080,
    height: 1080,
    sign: 'Machado ↔ Alfenas',
    alt: 'Post do Instagram da Busfeest sobre o transporte diário de trabalhadores e estudantes entre Machado e Alfenas',
    isPost: true,
  },
  {
    id: 'post-juizdefora',
    category: 'Fretamento & Escolas',
    src: media.onibusAlfenasJuizDeFora,
    width: 1080,
    height: 1080,
    sign: 'Alfenas ↔ Juiz de Fora',
    alt: 'Post do Instagram da Busfeest com os dois ônibus contratados para levar 123 passageiros de Alfenas a Juiz de Fora',
    isPost: true,
  },
]
