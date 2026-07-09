# Roteiros — Vídeos do Zappy · Módulo 1 (Ideia)

Vídeos verticais (9:16), ~30s, exibidos ANTES de cada missão. Voz do Zappy: jovem, energética, tom de irmão mais velho fundador — nunca professor. Estrutura fixa: **gancho (0–5s) → ideia central (5–20s) → chamada pra missão (20–30s)**.

Produção: Higgsfield Kling 3.0, image-to-video a partir das poses do Zap Core, fala em PT-BR no prompt. Clipes de até 15s — cada vídeo de 30s = 2 clipes emendados (corte no beat da virada pra missão). Piloto da Missão 1 já gerado (10s, `assets/videos/missao-1.mp4`).

---

## Missão 1 — Caça à primeira ideia

**Cena:** Zappy acenando → empolgado, aponta pra câmera no final.

> Fala, fundador! Sabia que a LEGO começou numa oficina de madeira, vendendo brinquedo de pato? Todo negócio gigante começou com uma ideia pequena. E a sua tá escondida num lugar óbvio: nas coisas que você AMA fazer. Desenhar, cozinhar, jogar — tudo pode virar negócio. Sua missão de hoje: lista 3 coisas que você adora, pergunta pra 2 pessoas o que elas comprariam de você, e escolhe UMA pra começar. Bora caçar essa ideia!

## Missão 2 — Detetive de clientes

**Cena:** Zappy curioso (pose thinking), lupa imaginária, vira detetive.

> Fundador, uma verdade que ninguém te conta: negócio não começa com produto. Começa com PESSOA. Quem vai comprar de você? Seu colega? Sua vizinha? A galera do condomínio? Detetive bom não adivinha — investiga. Sua missão: descreve seu cliente ideal, descobre onde ele tá, e anota qual problema a sua ideia resolve pra ele. Quando você sabe pra QUEM vende, vender fica fácil. Pega a lupa e vai!

## Missão 3 — Preço que vende

**Cena:** Zappy com moedas/calculadora imaginária, gesto de "conta de cabeça".

> Pergunta de milhão: quanto custa o que você faz? Se você cobrar menos que o custo, você PAGA pra trabalhar. Se cobrar caro demais, ninguém compra. O segredo é uma continha simples: quanto custa fazer + quanto você quer ganhar = seu preço. E espia os preços parecidos por aí pra não viajar. Sua missão: calcula teu custo, pesquisa 3 preços, e define o SEU. Fundador que sabe seu número, negocia de cabeça erguida.

## Missão 4 — Primeira oferta

**Cena:** Zappy confiante, "apresentando" com as mãos, termina com pose de hero.

> Chegou a hora de falar em voz alta. Toda venda do mundo cabe numa frase: EU VENDO tal coisa, POR tanto, PRA tal pessoa. Simples assim. Mas atenção: frase boa não nasce pronta — nasce treinada. Sua missão: monta a sua frase, fala ela pra 3 pessoas de verdade, e repara na reação. Olho brilhou? Anotou. Cara de dúvida? Anota também. Fundador não tem vergonha da própria oferta. Bora treinar a tua!

## Missão 5 — Plano de fundador

**Cena:** Zappy "juntando peças" no ar, final comemorando (pose celebrating).

> Olha você aqui: ideia escolhida, cliente mapeado, preço definido, oferta treinada. Sabe o que falta? Uma DATA. Sonho sem data é só sonho — com data, vira plano. Sua última missão do módulo: junta tudo que você descobriu, define uma meta de primeira semana — tipo vender 3 unidades — e marca no calendário o dia de começar. Quando essa data chegar, a {empresa} sai do papel. E aí, fundador... o jogo começa de verdade. Te vejo lá!

---

## Notas de produção

- **Voz + lip sync (pipeline definitivo, validado no piloto):** áudio PRIMEIRO, vídeo depois.
  1. Gerar a fala com TTS pt-BR nativo: edge-tts `pt-BR-AntonioNeural`, rate +14%, pitch +20Hz (o TTS do Kling lê português com fonética espanhola — não usar).
  2. Upload do MP3 no Higgsfield e gerar o vídeo com **Wan 2.7** (`start_image` = pose 9:16 + `audio` = MP3): a boca é animada seguindo o áudio — lip sync nativo, sotaque garantido.
  3. Voz idêntica nos 5 vídeos por construção. Upgrade futuro: ElevenLabs no passo 1 pra voz com mais personalidade de mascote.
- **Fundo:** piloto em fundo branco (herda da arte). Pra produção, gerar poses em fundo dark `#0A0A0A` pra integrar com a UI.
- **Legendas:** sempre — criança costuma assistir sem som; queimar legenda no vídeo ou usar track no player.
- **No app:** vídeo é pulável após 3s (autonomia > obrigação) e a missão nunca depende do vídeo pra fazer sentido.
