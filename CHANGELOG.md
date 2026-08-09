# Changelog — Landing Page Busfeest

Resumo de todas as alterações feitas até agora na branch `feature/UI`, em três commits/fases. Nenhuma foi enviada ao remoto (`push`) ainda.

---

## Fase 1 — Fundação (`b6d7fe0`)

**Objetivo**: corrigir base técnica, performance, SEO e acessibilidade, e preparar a arquitetura de componentes.

### Arquitetura de componentes
- Reorganização de `components/*.tsx` em `components/sections/`, `components/layout/` e `components/brand/`.
- `components/ui/button.tsx`: novas variantes (`cta`, `cta-outline`, `cta-dark`) e tamanhos (`cta`, `cta-lg`, `cta-md`, `cta-sm`, `cta-mobile`) cobrindo os estilos de pílula da marca.
- `components/brand/whatsapp-cta.tsx` (novo): componente único que monta o link do WhatsApp e aplica o estilo de CTA — elimina duplicação que existia em 5 arquivos diferentes.
- Todos os CTAs (hero, header desktop/mobile, rotas, prova social, CTA final) passaram a usar `Button`/`WhatsappCta` em vez de `<a>` cru com classes repetidas manualmente.

### Performance
- `next.config.mjs`: removida `images.unoptimized: true` — imagens voltam a passar pela otimização automática do Next (AVIF/WebP, resize).

### Acessibilidade
- Skip-link ("Pular para o conteúdo") adicionado em `app/layout.tsx`.
- Menu mobile do header corrigido para não ficar focável via teclado enquanto escondido (`inert`).
- `components/brand/logo.tsx`: rótulo acessível unificado (antes o símbolo e o wordmark eram anunciados como duas imagens separadas).
- Headings `<h2>` decorativos do footer rebaixados, para não competir no outline de heading da página.
- Contraste `text-gray` sobre `bg-navy` conferido (≈9:1 e ≈6.3:1) — já estava acima do mínimo AA, nenhuma mudança de paleta necessária.

### SEO
- `metadataBase`, imagem de Open Graph, Twitter card e `canonical` em `app/layout.tsx`.
- `app/robots.ts` e `app/sitemap.ts` novos.
- Dados estruturados JSON-LD (`LocalBusiness`) com os dados de `lib/site.ts`.
- `app/apple-icon.tsx` novo (gerado via `ImageResponse`, reaproveitando o símbolo da marca).
- Domínio ainda não definido → `NEXT_PUBLIC_SITE_URL` com placeholder documentado (`TODO` no código); configurar quando o domínio final existir.

### Tooling
- `eslint` + `eslint-config-next` instalados e `eslint.config.mjs` criado — `pnpm lint` não funcionava antes (faltava a dependência).
- `pnpm-workspace.yaml` corrigido (tinha uma sintaxe inválida que bloqueava `pnpm install`).
- Geração automática de `AGENTS.md`/`CLAUDE.md` do Next 16 desativada (`agentRules: false`) — feature nova do framework que criava arquivos indesejados no repo.
- Ícones antigos de `public/` (placeholders do scaffold v0.dev) removidos.

---

## Fase 2 — Motion com Framer Motion (`0c70719`)

**Objetivo**: dar movimento ao site sem repetir a mesma animação de fade em todas as seções — cada seção tem uma coreografia própria, mas todas compartilham os mesmos tokens de easing/spring (`lib/motion.ts`).

### Coreografia por seção
- **Hero**: entrada em cascata ao carregar (badge → título → texto → CTAs → estatísticas) + zoom lento contínuo no fundo.
- **About**: texto sobe e aparece; imagem entra da direita com leve zoom; o `RoadDivider` "se desenha" (`scaleX` 0→1).
- **Services**: cards em stagger vertical; o chevron desliza para a direita no hover (CSS puro).
- **Routes**: chips de rota entram da esquerda, em stagger horizontal (sem hover artificial, já que não são clicáveis).
- **Differentials**: ícone faz um "pop" com spring, levemente atrasado em relação ao texto.
- **SocialProof**: lista de públicos atendidos entra da direita — direção oposta à de Routes, de propósito.
- **FinalCta**: única seção com a faixa `road-dashes` em movimento contínuo (CSS puro, via `@keyframes` em `app/globals.css`).
- **SiteHeader**: menu mobile passou a usar `AnimatePresence` (desmonta do DOM quando fechado — reforça a correção de foco da Fase 1); nav desktop ganhou sublinhado animado no hover.

### CTAs
- `MotionButton` (`lib/motion.ts`, via `motion.create(Button)`) dá hover/tap elástico a todos os CTAs em pílula. Isso exigiu adicionar `forwardRef` ao `Button` (`components/ui/button.tsx`).

### `prefers-reduced-motion`
- Implementado via `<MotionConfig reducedMotion="user">` (`components/motion-provider.tsx`), envolvendo o site inteiro em `app/layout.tsx`.
- **Bug encontrado e corrigido durante o teste**: a primeira versão checava a preferência manualmente em cada componente (`useReducedMotion()`), o que causava erro de hidratação — o servidor não tem como saber a preferência do sistema operacional do usuário, então servidor e cliente renderizavam estados diferentes. A solução foi usar o `MotionConfig`, que resolve isso dentro do motor de animação do Framer Motion, só depois da hidratação.

---

## Fase 3 — Galeria de viagens (`998dff2`)

**Objetivo**: substituir a ideia original de "seção de depoimentos" (rejeitada pelo usuário) por uma galeria visual de viagens/eventos, a pedido do usuário.

- `lib/gallery.ts` (novo): categorias (Excursões & Turmas, Festas & Shows, Corporativo, Famílias & Igrejas — reaproveitando os públicos já reais do site) e 10 itens placeholder.
- `components/sections/gallery.tsx` (novo): seção entre Rotas e Diferenciais, com:
  - Grid bento (tiles de tamanhos variados via CSS Grid `dense`).
  - Filtro por categoria com indicador de aba deslizante (`layoutId` compartilhado do Framer Motion).
  - Reflow animado do grid ao trocar de filtro (`AnimatePresence` + `layout`).
- **Sem fotos reais ainda**: os tiles são placeholders visuais explícitos (gradiente da paleta da marca + ícone de câmera + rótulo só com a categoria, sem inventar destino/data específicos). O texto da seção já avisa visitantes que o álbum está em produção — importante caso o site seja publicado antes de você adicionar fotos reais.
- `lib/motion.ts`: novo variant `tileReveal` para a entrada dos tiles.

---

## Verificação feita em todas as fases

- `pnpm lint`, `tsc --noEmit` e `pnpm build` limpos após cada fase.
- Testes reais no navegador via Playwright headless: screenshots desktop/mobile, teste de teclado (skip-link, menu mobile), emulação de `prefers-reduced-motion: reduce` (0 erros de hidratação), console do navegador sem erros/avisos.

---

## Pendências / próximos passos

- **Domínio**: `NEXT_PUBLIC_SITE_URL` ainda é um placeholder — configurar na Vercel quando o domínio final for definido.
- **Fotos reais**: da galeria (Fase 3) e, eventualmente, do hero/about.
- **Auditoria de performance/acessibilidade formal**: Lighthouse/Core Web Vitals e um scanner tipo axe ainda não foram rodados — só verificação manual/visual até agora.
- **Redesign de layout em discussão**: o usuário deu feedback de que o site ainda parece "genérico"/feito por IA, mesmo com o trabalho das 3 fases — o padrão repetido de "rótulo + título + parágrafo + grid" em várias seções é o principal suspeito. Aguardando referências visuais do usuário para propor uma direção de composição/tipografia mais distintiva antes de implementar.
- **Push**: nenhum commit foi enviado ao remoto ainda.
