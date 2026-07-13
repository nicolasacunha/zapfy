# ADR 0001 — O render SVG do Zappy sustenta as skins pagas

- Data: 2026-07-13
- Status: Aceito

## Contexto

`src/components/Zappy.jsx` tem dois caminhos de render:

- `skin === 'default'` → PNG (`MOOD_IMGS`) — o caminho principal, alinhado ao
  guardrail do projeto ("mascote sempre PNG, nunca SVG em código").
- `skin !== 'default'` → um SVG desenhado à mão (~75 linhas, `Zappy.jsx:73-148`),
  com a cor do corpo variando por skin (`SKIN_COLORS`).

Uma revisão de arquitetura sugeriu colapsar esse SVG legado em "só PNG"
(deletion test: removeria ~75 linhas).

## Decisão

**Não remover o render SVG.** Ele não é código morto: é o único mecanismo que dá
variação de cor às skins cosméticas:

- `golden` — IAP `zapfy_skin_golden` (`lib/purchases.js`), `available: true` na
  loja (`ShopScreen.jsx`), usada em Paywall, Pathway e FounderCard.
- `astronaut` — usada em `FounderCelebration` e `FounderCard`.

Não existem PNGs por skin; a diferenciação vem de `bodyColor` no SVG.

## Consequências

- Deletar o SVG faria `golden`/`astronaut` caírem no PNG default, apagando o
  visual que a criança comprou — quebra de cosmético e de monetização.
- Migrar para "só PNG" exigiria **produzir PNGs coloridos por skin** (trabalho de
  arte), o que está fora do escopo de um refactor de código.
- O guardrail "sempre PNG" vale para o mascote default; as skins cosméticas são a
  exceção deliberada, sustentada por este SVG.
- Futuras revisões de arquitetura **não devem re-sugerir remover este SVG** sem
  que antes existam PNGs por skin.
