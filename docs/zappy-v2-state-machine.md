# Zappy — Máquina de Estados de Relacionamento (v2)

> Fundação pro Zappy virar um "ser vivo" que exige relação. Define **estados, gatilhos e decaimento**. A arte (Higgsfield) e a animação (Rive) saem desta máquina — não o contrário. Gere primeiro a máquina, depois a arte que ela pede.

---

## Princípio

O Zappy roda **duas camadas emocionais ao mesmo tempo**:

1. **Humor de Vínculo** (lento) — reflete o relacionamento de longo prazo: você é constante ou some? É a "vitalidade" do Zappy, estilo tamagotchi. Muda devagar, ao longo de dias.
2. **Reação Momentânea** (rápido) — responde a um evento específico (acertou, errou, vendeu de verdade). Toca 1–3s e volta pro humor de base.

O Humor de Vínculo é o "clima" do Zappy hoje; a Reação é a "expressão" do momento. Quem está numa ofensiva de 10 dias encontra um Zappy radiante que comemora forte. Quem sumiu 4 dias volta e encontra um Zappy apagado — que se ilumina no instante em que aparece.

---

## Regra inegociável: anti-vergonha

Vocês são um app pra crianças e adolescentes. **O Zappy nunca culpa, nunca cobra com raiva, nunca usa vergonha.** Ausência deixa o Zappy com saudade e sem energia — não bravo. Voltar é **sempre** comemorado, nunca punido. Essa é a linha que separa "companheiro" de "dark pattern" — e é o que protege vocês na App Store e com os pais.

- Errar → "ops, quase" empático, nunca decepção.
- Sumir → "tô com saudade", nunca "você me abandonou".
- Voltar depois de sumir → festa, nunca sermão.

Anti-vergonha é regra de **copy e de arte**: nenhuma expressão brava ou decepcionada entra no set.

---

## Camada 1 — Humor de Vínculo (energia 0–100)

Um número só: a energia do Zappy. Sobe quando você aparece, cai quando você some.

| Faixa | Estado | Como o Zappy está | Quando acontece |
|------|--------|-------------------|-----------------|
| 90–100 | **Radiante** | Verde vibrante, brilho, faíscas, olhos brilhando | Ofensiva ativa, uso diário |
| 60–89 | **Animado** | Saudável, alerta, sorriso leve (estado padrão) | Uso regular |
| 30–59 | **Quietinho** | Verde mais opaco, faísca fraca, folhas meio murchas, esperando | 1–2 dias sem aparecer |
| 1–29 | **Saudade** | Apagado, sentadinho, olhando pra "porta" | 3+ dias sem aparecer |
| 0 | **Cochilando** | Enroladinho, dormindo — acordar ele é evento | Ausência longa |

**Regra de decaimento (ponto de partida — ajustar com dado real):**

- Dia de uso: energia sobe forte (ex.: +40, teto 100).
- 1º dia ausente: carência — não cai (ou cai pouco, -5).
- A partir do 2º dia ausente: -15/dia.
- Voltar dá salto grande imediato (ex.: +35) — reencontro tem que ser gostoso na hora.

O número exato importa menos que **o formato da curva: cai devagar o suficiente pra dar tempo de voltar, e recupera rápido pra que voltar valha a pena.**

---

## Camada 2 — Reações Momentâneas (evento → 1–3s → volta pro humor)

| Gatilho | Reação | Intensidade |
|--------|--------|-------------|
| Acertou questão | Pulinho feliz | leve |
| Combo de acertos na lição | Comemoração crescente | média |
| Errou questão | "Ops" empático, encolhe de leve | leve (sem vergonha) |
| Concluiu lição | Cheer | média |
| Subiu de nível / fim de módulo | Forma herói, festa | alta |
| Marco de ofensiva (7 / 30 dias) | Festa + evolução visual | alta |
| **Missão real concluída com prova (1ª venda!)** | **Maior comemoração do app — herói, fogos** | **máxima** |
| Bônus diário / baú | Surpresa | média |
| Carregamento / reflexão | Pensando | neutro |

**O momento-assinatura é a missão do mundo real.** É o que o Duolingo não consegue fazer. A maior explosão de comemoração do app inteiro tem que ser reservada pra quando a criança **vende algo de verdade e traz a prova**. Se a comemoração da venda real for igual à de uma lição qualquer, você desperdiçou seu maior diferencial.

Escala variável: comemoração grande só nos momentos raros — senão vira ruído e morre em uma semana.

---

## Notificações (imagem estática + copy)

Cada push = imagem do Zappy no humor certo + copy curta. Tom: animado, com saudade, nunca culpa.

| Situação | Zappy | Copy (exemplo) |
|----------|-------|----------------|
| Lembrete diário (no horário) | Animado, acenando | "Bora, [nome]? O Zappy separou a missão de hoje." |
| Ofensiva em risco (fim do dia) | Segurando a chama, esperançoso | "Faltam [X]h pra não perder sua ofensiva de [N] dias." |
| Saudade (2–3 dias) | Quietinho, olhando pra porta | "Já fazem [X] dias. O Zappy tá sentindo sua falta." |
| Reativação (sumiço longo) | Cochilando | "Psiu… o Zappy cochilou te esperando. Bora acordar ele?" |
| Nudge missão real | Herói, animado | "Hoje é dia de missão de verdade. O Zappy quer te ver vender." |
| Pós-conquista (dia seguinte) | Orgulhoso | "Ontem você mandou bem. Bora repetir a dose?" |

---

## Evolução (camada opcional, v2.1)

O Zappy evolui visualmente em marcos (nível / ofensiva): brotinho → forma atual → forma herói com equipamento. "Meu Zappy" vira identidade e motivo de voltar. Casa com a loja de skins que já existe no código (`ShopScreen`, `ZappyWithSkin`).

---

## Shot-list de arte (o que pedir pro Higgsfield / pro animador Rive)

Mesmo personagem, mesmo traço (contorno preto grosso, verde glossy, faísca-raio), fundo transparente.

**Expressões de rosto (humor + reação) — formato "cabeça":**

1. Radiante (brilho / faíscas)
2. Animado (padrão)
3. Quietinho (apagado, folha murcha)
4. Saudade (olhando pra porta, sentado)
5. Cochilando (dormindo)
6. Acerto (pulinho feliz)
7. Erro / ops (empático)
8. Pensando
9. Surpresa
10. Orgulhoso

**Forma herói (corpo inteiro) — momentos grandes:**

11. Comemoração máxima (fogos / punho pra cima)
12. Segurando a chama da ofensiva
13. Acenando (lembrete)

~13 poses. As 10 de rosto cobrem notificação + reação do dia a dia; as 3 de corpo cobrem os momentos épicos.

---

## Notas de implementação (pro dev)

- Campo persistente: `zappyEnergy` (0–100) + `lastActiveDate`. Recalcula no app-open.
- Humor = bucket de `zappyEnergy`. Reação = evento transitório que sobrepõe o humor por 1–3s.
- Reações disparam dos mesmos eventos que já existem (acerto, lição, level-up, missão real, milestone).
- Quando migrar pra Rive: cada estado vira um "input" da state machine do Rive; o código seta o input, o Rive faz a transição/blend. A arte gerada agora serve de referência pro rig.
