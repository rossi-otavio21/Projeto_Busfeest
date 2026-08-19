# Busfeest — armadilhas do projeto

Registro de erros que já custaram tempo aqui. Cada item existe porque o bug
chegou a produção ou passou por uma revisão sem ser visto.

---

## Ramo "sem animação" nunca é `undefined`

Ramo "sem animação" nunca é `undefined` — sempre o valor de repouso
explícito. `usePrefersReducedMotion` só vira `true` depois da hidratação,
então o primeiro render já escreveu o estado inicial e
`whileInView={undefined}` não o desfaz. Movimento reduzido zera a duração;
não remove o alvo.

```tsx
// ❌ o alvo some, e o que já foi escrito no elemento continua lá
animate={reduceMotion ? undefined : { opacity: 1 }}
style={heavyMotion ? { opacity: textOpacity } : undefined}

// ✅ o alvo é sempre o mesmo; só a duração muda
animate={{ opacity: 1 }}
transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
style={heavyMotion ? { opacity: textOpacity } : { opacity: 1 }}
```

### Por que alguns casos parecem funcionar

`components/motion-provider.tsx` envolve o site em
`<MotionConfig reducedMotion="user">`, que desliga **transform e layout**
sob movimento reduzido — mas mantém `opacity`, cor e `pathLength`.

Então o mesmo erro tem dois desfechos:

| Propriedade animada | `undefined` no ramo sem movimento |
| --- | --- |
| `x`, `y`, `scale`, `rotate` | mascarado pelo MotionConfig — parece certo |
| `opacity`, `pathLength`, filtros | **quebra**: o elemento fica invisível |

Isso torna o erro difícil de ver em revisão: quem testou num transform
conclui que o padrão é seguro e o repete numa opacidade.

### Onde já aconteceu

- `components/sections/home/about.tsx` — a seção "Quase 6 anos" ficou
  invisível em **todo celular**. `style={heavyMotion ? {...} : undefined}`
  com `opacity`; o primeiro render (ainda se achando desktop) escreveu
  `opacity: 0` e nada devolveu para 1.
- `components/sections/rotas/rotas-mapa.tsx` — os quatro arcos do mapa não
  apareciam sob movimento reduzido. Mesmo padrão, com `pathLength`.

### Como conferir

Não confie em ler o JSX: os dois casos acima passaram por revisão. Abra com
movimento reduzido e meça o valor computado.

```bash
# DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce
# ou, no Playwright:
browser.newContext({ reducedMotion: 'reduce' })
```

Procure por elemento com `opacity: 0` ou `stroke-dasharray: 0px, 1px`
parado. Também vale rodar a varredura:

```bash
grep -rn "reduceMotion\|usePrefersReducedMotion" --include="*.tsx" .
```

---

## O mapa de Rotas não volta a ser mapa de tiles

`components/sections/rotas/rotas-mapa.tsx` é SVG puro de propósito. Antes
era MapLibre: WebGL, worker vendorizado à mão em `/public` e geojson servido
ao navegador — 1,6 MB para um elemento com `interactive={false}`. Só
reintroduzir biblioteca de mapa se aparecer necessidade real de navegação
(zoom, pan, clique em cidade).

A malha vem de `malha-pontos.generated.ts`, gerada em build por
`scripts/gerar-malha-pontos.ts` (`pnpm gerar:malha`). O geojson do IBGE vive
em `data/`, fora de `/public`, justamente para não ser servido.

**A moldura mora no gerador, não em `rotas-data.ts`.** Ela viaja no arquivo
gerado junto da projeção que a produziu. Separar as duas é acoplamento
invisível: alguém muda o recorte, não regera, os arcos saem dos pontos e
nada quebra alto.

Uma tentativa que não funciona: recortar a silhueta com a lib `dotted-map`
usando `countries: ['BRA']`. Neste recorte (~1.300 km, todo dentro do
Brasil) não há contorno de país para desenhar — ela devolve exatamente o
mesmo número de pontos que sem filtro, e o mapa vira um retângulo cheio. São
as divisas estaduais que fazem a região ser reconhecível.

---

## Nada de dado inventado

Telefone, cliente, rota, número de viagens, parceria, depoimento: se não
houver fonte, fica pendente. As fontes confirmadas estão versionadas em
`public/images/originais/` — são posts publicados pela própria Busfeest.
Todo número que aparece no site sai de lá ou do material que o dono enviou.

---

## Pintura de terceiro só na galeria

A Busfeest contrata veículo de terceiro, então quase toda foto de ônibus do
acervo traz a marca de outra operadora (SC Minas, Dozza, ACM). Livery de
terceiro não entra em Hero, foto de seção nem card de serviço — só na
galeria, que é acervo documental e mostra a foto inteira, sem recorte.
