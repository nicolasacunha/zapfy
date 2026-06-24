# Zappy — Notificações (push) v2

> Os pushes são a voz do Zappy fora do app. Cada um é ligado a um estado da máquina (`docs/zappy-v2-state-machine.md`): a imagem é o humor do Zappy, a copy fala por ele.

## Princípio + regra anti-vergonha

App de criança/adolescente. **Nenhuma notificação culpa, cobra com raiva ou usa vergonha.** O Zappy sente saudade e convida — nunca acusa. Sumir é normal; voltar é sempre comemorado.

- Errar/sumir → "tô com saudade", "guardei seu lugar". Nunca "você me abandonou", "cadê você?".
- Tom: caloroso, leve, com a personalidade do Zappy. Frases curtas. Emoji com moderação.

## Regras de frequência (anti-spam)

- **Máximo 1 push por dia** em situação normal. Exceção: ofensiva-em-risco pode somar ao lembrete só no dia do risco.
- **Horário silencioso**: nada entre 21h–8h.
- Lembrete diário sai no horário que a criança costuma usar (ou o configurado pelos pais).
- Se a criança já abriu o app no dia, **não** manda lembrete naquele dia.
- Pushes de saudade/reativação têm teto: no máximo 1 a cada 2 dias, pra não virar perseguição.

Placeholders: `[nome]` (apelido da criança), `[N]` (dias de ofensiva), `[X]` (horas/dias).

---

## Conjunto de notificações

### 1. Lembrete diário
- **Gatilho:** todo dia no horário de uso, se ainda não abriu hoje.
- **Estado do Zappy:** Acenando
- **Título:** O Zappy te chamou
- **Corpo (variações):**
  1. "Psiu, [nome]! Tua missão de hoje já tá pronta. 2 minutinhos? 👋"
  2. "O Zappy separou a missão do dia pra você. Bora?"
  3. "Bate um instante aqui — o Zappy quer te mostrar uma coisa."

### 2. Ofensiva em risco
- **Gatilho:** fim do dia (ex.: 19h), ofensiva ativa e ainda não jogou hoje.
- **Estado do Zappy:** Segurando a chama
- **Título:** Tua ofensiva tá acesa 🔥
- **Corpo:**
  1. "Faltam poucas horas pra não perder teus [N] dias seguidos. Salva em 2 min!"
  2. "O Zappy tá segurando a chama dos [N] dias por você. Bora manter?"
  3. "[N] dias é muita coisa. Não deixa apagar hoje."

### 3. Saudade (sumiço curto)
- **Gatilho:** 2–3 dias sem abrir.
- **Estado do Zappy:** Saudade
- **Título:** O Zappy tá com saudade
- **Corpo:**
  1. "Faz [X] dias… o Zappy ficou meio quietinho sem você. Dá um oi?"
  2. "Tá tudo bem por aí? O Zappy tá sentindo sua falta."
  3. "Bateu uma saudade aqui. Volta quando puder — tem missão nova te esperando."

### 4. Reativação (sumiço longo)
- **Gatilho:** 5+ dias sem abrir (máx 1 a cada 2 dias).
- **Estado do Zappy:** Cochilando
- **Título:** O Zappy cochilou te esperando 😴
- **Corpo:**
  1. "Tá tudo bem sumir. O Zappy guardou seu lugar. Bora acordar ele?"
  2. "Psiu… o Zappy tirou um cochilo te esperando. Volta com calma."
  3. "Sem pressão. Quando bater a vontade, o Zappy tá aqui pra recomeçar com você."

### 5. Nudge missão real
- **Gatilho:** tem missão de mundo real disponível e ainda não feita.
- **Estado do Zappy:** Comemoração / herói animado
- **Título:** Hoje tem missão de verdade
- **Corpo:**
  1. "Sair do app e fazer acontecer no mundo real — o Zappy quer te ver nessa."
  2. "Tua missão do mundo real te espera. Bora pôr a mão na massa?"
  3. "Empreendedor de verdade faz. O Zappy aposta em você nessa missão."

### 6. Pós-conquista (reforço positivo)
- **Gatilho:** dia seguinte a uma sessão boa / lição perfeita / marco.
- **Estado do Zappy:** Orgulhoso
- **Título:** O Zappy ainda tá orgulhoso 😎
- **Corpo:**
  1. "Ontem você mandou bem demais. Bora repetir a dose hoje?"
  2. "Você tá pegando o jeito de empreendedor. Mais uma hoje?"
  3. "O Zappy contou pra todo mundo o que você fez ontem. Bora continuar?"

### 7. Marco de ofensiva (comemoração)
- **Gatilho:** ofensiva atinge 7 / 30 / 100 dias.
- **Estado do Zappy:** Radiante / Comemoração
- **Título:** [N] dias seguidos! 🎉
- **Corpo:**
  1. "O Zappy tá pulando aqui! [N] dias de ofensiva — você é constante de verdade."
  2. "[N] dias sem falhar. Pouca gente chega aqui. Orgulho desbloqueado."

---

## Mapa estado → imagem do push

| Notificação | Estado (asset) |
|-------------|----------------|
| Lembrete diário | `acenando` |
| Ofensiva em risco | `chama` |
| Saudade | `saudade` |
| Reativação | `cochilando` |
| Nudge missão real | `comemoracao` |
| Pós-conquista | `orgulhoso` |
| Marco de ofensiva | `radiante` |

A imagem entra como anexo da notificação (thumbnail à direita no iOS). Usar os PNGs transparentes de `src/assets/zappy/` sobre um fundo sólido (o iOS não mostra transparência no thumbnail — gerar versões com fundo do app `#0C1222` se necessário).

## Próximo passo (implementação, quando aprovado)

- Capacitor Local Notifications: agendar lembrete diário + checagens de ofensiva/sumiço no app-open.
- Calcular o estado a partir de `zappyEnergy`/`zappyLastActive` (já existe) pra escolher imagem + copy.
- Pedir permissão de notificação no onboarding (com copy do Zappy, não um alerta seco do sistema).
