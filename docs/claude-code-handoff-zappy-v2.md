# Handoff pro Claude Code — Zappy v2 (Zapfy)

Você está assumindo a continuação do trabalho do **Zappy v2**, o sistema de mascote/companheiro do app Zapfy (educação de empreendedorismo pra crianças/adolescentes, PT-BR). Abaixo está tudo que você precisa pra continuar sem quebrar nada.

---

## 1. Projeto e como rodar

- **Pasta:** `/Users/nicolascunha/Projects/Business/apps/zapfy/02 - Produto/zapfy-mvp`
- **Stack:** React + Vite (rolldown-vite) + Capacitor (iOS). UI mobile-first, sem TypeScript (arquivos `.jsx`).
- **Estado:** context via reducer em `src/context/ZapfyContext.jsx`, persistido em `localStorage` (offline-first). Não é Zustand.
- **Rodar local:** `npm run dev` → abre em `http://localhost:5173`.
- **Verificar build:** `npm run build` (tem que passar limpo antes de declarar qualquer tarefa pronta).
- **Lint:** `npm run lint`.
- **Atalho de demo:** abrir `http://localhost:5173/#lab` cai direto no **Zappy Lab** (sem login) — força qualquer humor/estado. Também acessível por **Perfil → 🧪 Zappy Lab**.

Se o git reclamar de lock (`.git/index.lock` etc.), pode rodar `rm -f .git/*.lock*` na pasta do projeto — é lixo de um ambiente anterior, não atrapalha.

---

## 2. O que é o Zappy v2 (já construído)

O Zappy virou um **pet pessoal** que a criança possui, nomeia, cuida, visita e reencontra. Peças:

- **Máquina de estados** (`src/lib/zappyState.js`): energia 0–100 (`zappyEnergy`), humor por faixa (`moodFromEnergy`): radiante / animado / quietinho / saudade / cochilando. Decaimento por dias de sumiço (`decayEnergy`), recuperação ao jogar (`registerActivity`). Reações momentâneas (`REACTIONS`). Evolução por nível (`evolutionStage`/`nextEvolution`/`EVOLUTIONS`): brotinho → herói → lenda. Doc: `docs/zappy-v2-state-machine.md`.
- **Arte** (`src/assets/zappy/*.png`, transparentes 1024²): radiante, saudade, quietinho, cochilando, ops, orgulhoso, comemoracao, chama, acenando + evolução brotinho/heroi/lenda. Mapeadas em `src/components/Zappy.jsx` (`<Zappy mood="..." />` ou `<Zappy energy={n} />`).
- **Companheiro vivo** (`src/components/ZappyCompanion.jsx`): card no topo da Trilha, humor por energia, 3 falas por humor (sorteadas), reação ao toque.
- **Abraço de boas-vindas** (`src/components/ZappyWelcomeBack.jsx`): banner na Trilha quando volta após 2+ dias (1x/sessão).
- **Tela "Meu Zappy"** (`src/screens/MeuZappyScreen.jsx`, rota `meuZappy`): forma de evolução, energia, trilha de evolução, stats, **fazer carinho** (toque → bounce + corações + som), e **renomear** o Zappy. Entrada: avatar do Perfil.
- **Nome do Zappy:** `state.zappyName` (default 'Zappy'), ação `SET_ZAPPY_NAME`. Usado no Meu Zappy e no companheiro.
- **Reações espalhadas:** lição (acerto→radiante / erro→ops, com **combo** que escala em x3+), resultado (radiante se perfeito / orgulhoso), **lição perfeita** (selo + fanfarra), level-up (radiante + **momento de evolução** quando troca de forma), marco de ofensiva (comemoração), bônus diário (surpresa→orgulhoso), missão real (mega-comemoração), vidas esgotadas (ops, anti-vergonha), perfil (avatar = forma de evolução).
- **Sons** (`src/lib/sound.js`, sintetizados em Web Audio, sem arquivos): `playLevelUp`, `playEvolve`, `playReward`, `playComboAccent` + os existentes.
- **Zappy Lab** (`src/screens/ZappyLabScreen.jsx`): tela de demonstração pra forçar estados.

### Commits-checkpoint desta fase (referência)
`ba9bc1a` (base v2) → `a1d1bfb` (combo/personalidade/sons) → `0ed111d` (lição perfeita) → `35da92b` (Meu Zappy) → `8f15603` (nome) → `9ec559a` (abraço de boas-vindas).

---

## 3. Regras inegociáveis

1. **NÃO subir nada pro TestFlight / App Store.** Sem `eas`, sem `cap` archive, sem upload. É trabalho local.
2. **Checkpoint sempre que fizer mudança grande:** rodar `npm run build` (tem que passar) e fazer um commit **escopado** com mensagem `conventional` (`feat(zappy-v2): ...`).
3. **Commit escopado:** o working tree tem MUITAS mudanças não-relacionadas, de sessões antigas. **Só dê `git add` nos arquivos que você mexeu.** Nunca `git add -A` / `git add .`.
4. **Voz da marca:** Zappy = "irmão mais velho fundador", caloroso, direto, nunca professor/escola. Copy sempre em **PT-BR**.
5. **Anti-vergonha (regra dura):** é app de criança. O Zappy **nunca culpa, cobra com raiva ou usa vergonha.** Sumir é normal; voltar é sempre comemorado; errar é "ops" empático.
6. **Arte (se gerar mais):** personagem masculino, **sem bochecha rosada, sem cílios** (sai com cara feminina). Sem fogo/raio perto do cabelo. Use referência de corpo inteiro pra cenas. Sempre remover o fundo (gera com xadrez fake) pra PNG transparente.
7. **Mobile-first**, referência iPhone (390×844). Sem `<form>`, use `onPress`/`onClick`.

---

## 4. TAREFA ATUAL: passada de QA do Zappy v2

Antes de qualquer feature nova, faça uma revisão de qualidade do que já existe:

1. **Build + lint limpos** (`npm run build`, `npm run lint`) — corrija o que aparecer.
2. **Clique pelos fluxos** (`npm run dev`) e confira que nada quebrou nas telas que foram tocadas: Trilha (companheiro + boas-vindas), lição (reações + combo x3+ + vidas esgotadas), resultado (perfeito vs normal), level-up (normal vs evolução), marco de ofensiva, bônus diário, missão real, Perfil (avatar = forma), Meu Zappy (carinho + renomear), Zappy Lab.
3. **Regressões a caçar especificamente:**
   - `Zappy.jsx`: todas as `mood` keys novas resolvem imagem? Skins não-default ainda funcionam?
   - Decaimento no app-open (`ZapfyContext`): roda 1x, não em loop, e a energia recupera ao concluir lição.
   - Combo (`LessonScreen`): zera ao errar; não dispara som duplicado; o `key` de re-mount não buga.
   - Renomear (`MeuZappyScreen`): input não dá zoom travado no iOS (o viewport já tem `user-scalable=no`); salva e persiste; limite de 14 chars.
   - `ZappyCompanion` / `ZappyWelcomeBack`: não duplicam a mensagem de "saudade"; boas-vindas só 1x/sessão.
4. **Reporte** o que achou e corrija, com checkpoint(s).

---

## 5. Tarefas posteriores (direção: pet pessoal)

Depois do QA, seguir aprimorando nesta direção, sempre com checkpoint por mudança grande:

- **Nomear o Zappy no onboarding** — prompt logo no início (hoje só dá pra renomear no Meu Zappy). Fixa a posse desde o minuto 1. Cuidado ao mexer no fluxo de onboarding (`IntroSequence.jsx` / telas de auth).
- **Cosméticos/skins ligados à loja** (`ShopScreen` + `zapfySkin` já existem) — chapéus/itens pro Zappy, comprados com Zapcoins. Provavelmente precisa gerar arte nova (siga a regra 6).
- **Comportamentos de idle / mais vida** — variação de expressão quando parado. Obs: animação de verdade é **Rive** (vetorial, rigado), que é a próxima fronteira e vai precisar de um animador; a arte/estados atuais servem de referência pro rig. Não tente animar via vídeo/CSS pesado.
- **Mais momentos de reação** onde fizer sentido (sem exagerar — comemoração grande só em momento raro, senão vira ruído).

Use seu julgamento, mas valide direção com o Nicolas antes de gastar muito (especialmente geração de arte).

---

## 6. Como trabalhar

- Vá avisando cada coisa que fizer e a direção.
- Mudança grande → `npm run build` + commit escopado.
- Dúvida de direção que muda o que você constrói → pergunte antes.
- Tudo em PT-BR, na voz do Zappy.
