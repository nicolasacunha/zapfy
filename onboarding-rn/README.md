# Zapfy — Protótipo do app (React Native / Expo)

Estrutura completa do app, mobile-first (375px, iOS), dark + gold:
onboarding (9 telas) → Home com trilha de fases → 5 missões do Módulo 1 → tabs (Missões / Negócio) → paywall.

**Fluxo freemium:** Módulo 1 grátis; qualquer toque em conteúdo bloqueado (trilha, módulo 2, vendas) abre o paywall com handoff criança→responsável e planos R$69,90/mês ou R$599/ano.

**Princípio anti-Duolingo-vazio (casca de jogo, núcleo de realidade):**
- Prova do mundo real (foto/áudio/vídeo) vale 4x os passos auto-declarados (+200 vs 50). Anexo simulado — TODO expo-image-picker.
- Sem streak punitivo: destrave por missão concluída, não por login diário.
- Relatório do responsável (em Negócio): progresso em fatos ("fez a missão, com prova"), não em moedas.

## Ver agora (sem instalar nada)

Abra **`preview.html`** no navegador — protótipo navegável completo (onboarding → home → missões → paywall).

## Rodar o app de verdade (Expo)

```bash
npx create-expo-app@latest zapfy-app --template blank-typescript
cd zapfy-app
npx expo install expo-font @expo-google-fonts/inter react-native-safe-area-context expo-video expo-image-picker @react-native-async-storage/async-storage
```

Copie `App.tsx` e a pasta `src/` para a raiz do projeto (substituindo o `App.tsx` gerado) e:

```bash
npx expo start
```

Compatível com Expo SDK 56 (RN 0.85 / React 19.2 / Hermes v1). Usa apenas APIs core — sem dependência de navegação.

## Estrutura

```
App.tsx                        # Fontes Inter + providers + rotas (onboarding/tabs/missão/paywall)
assets/zappy/                  # 6 PNGs transparentes 512px do mascote (poses)
src/
  theme.ts                     # Tokens do design system (cores, radius, tipografia)
  OnboardingFlow.tsx           # Orquestrador do onboarding: progresso, voltar, slide+fade
  data/missions.ts             # 5 missões do Módulo 1 (título, brief do Zappy, passos, recompensa)
  store/OnboardingContext.tsx  # Estado global: perfil, ZapCoins, completedMissions
  components/
    PrimaryButton.tsx          # Botão gold full-width, estado disabled
    ProgressBar.tsx            # Barra fina gold animada no topo
    ScreenShell.tsx            # Layout padrão + footer fixo + keyboard avoiding
    TabBar.tsx                 # Tabs Início / Missões / Negócio
    JourneyPath.tsx            # Trilha de fases zigue-zague (lock → paywall)
    Zappy.tsx                  # Mascote por imagem (pose: neutral/hero/waving/celebrating/thinking/pointing)
  screens/
    SplashScreen.tsx           # Onboarding 1 — Logo + tagline
    NameScreen.tsx             # 2 — Nome da criança
    AgeScreen.tsx              # 3 — Pills 8–14
    CompanyNameScreen.tsx      # 4 — Nome da empresa
    CategoryScreen.tsx         # 5 — Grid 2x2 categoria
    ZappyIntroScreen.tsx       # 6 — Apresentação do Zappy
    HowItWorksScreen.tsx       # 7 — Como funciona
    SocialProofScreen.tsx      # 8 — Depoimentos
    ReadyScreen.tsx            # 9 — "[Nome], a [Empresa] acabou de nascer." → Home
    HomeScreen.tsx             # QG: missão do dia, trilha, ZapCoins
    MissionsScreen.tsx         # Lista das 5 missões (feita / hoje / bloqueada por dia)
    MissionScreen.tsx          # Missão genérica: passos checáveis + recompensa
    BusinessScreen.tsx         # Negócio: empresa, stats, vendas (módulo 4 → paywall)
    PaywallScreen.tsx          # Conversão: copy pro pai, planos mensal/anual (RevenueCat TODO)
```

## Decisões

- **Estado:** Context API (`useOnboarding()`) — zero dependência extra. Nome/empresa alimentam Home e missão; ZapCoins e progresso da missão 1 vivem no mesmo store.
- **Transições:** fade + slide horizontal (130ms out / 260ms in), direção invertida no "voltar". Sem react-navigation — rotas simples por estado em `App.tsx`.
- **Botões "Continuar":** só ativam com input válido (nome, idade, empresa, categoria).
- **Zappy:** artes oficiais do Zap Core (Higgsfield: variações + remove background, recorte e 512px). Masters 2048px ficam em `05 - Marketing/Zap Core/Variacoes/`. Para animação real, trocar por Lottie quando os vídeos ficarem prontos (blocker #2).
- **Módulos 2–5:** nomes ilustrativos no Home (bloqueados). Ajustar quando o conteúdo dos módulos fechar.
- **Missão 1:** "Caça à primeira ideia" — 3 passos do mundo real, ~10 min, recompensa +50 ZapCoins. Pensada pra janela das 72h: a criança age no primeiro dia.

## Piloto (Link School, ~12 crianças)

**Pronto no app:**
- Persistência local (AsyncStorage): fecha e reabre direto na Home, progresso intacto.
- Prova com foto real (expo-image-picker) — foto fica no dispositivo, aparece no relatório do responsável.
- Cadência: 1 missão/dia (`DAILY_GATE` em `store/OnboardingContext.tsx`; `false` para demo/teste).
- Vídeos do Zappy nas 5 missões (pt-BR, lip sync).
- Métricas locais (`lib/analytics.ts`): onboarding_complete, mission_start, proof_attached, mission_complete, paywall_view, parent_report_view. Export em Negócio → Relatório → "Exportar dados do piloto" (a família te manda o JSON no WhatsApp).

**Distribuição:** Expo Go (escaneia QR do `npx expo start`) para teste rápido, ou build instalável: `npx eas build --profile preview --platform android` (APK) / iOS via TestFlight.

**Métrica-chave do piloto:** % de crianças com `mission_complete { withProof: true }` na primeira semana.

**Pendências fora do código (donos: fundadores):**
1. RevenueCat com chave real (blocker #1) — irrelevante pro piloto gratuito; necessário pro lançamento.
2. IDs reais GA4 + Meta Pixel (blocker #3) — espelhar `track()` quando existirem.
3. Publicar `content/politica-privacidade.md` em URL pública (blocker #4) — preencher os campos [entre colchetes].

## Tokens

| Token | Valor |
|---|---|
| Background | `#0A0A0A` |
| Surface 1 / 2 | `#141414` / `#1C1C1C` |
| Gold / Gold light | `#C9A84C` / `#E2C06A` |
| Texto / secundário | `#EBEBEB` / `#888888` |
| Radius padrão | `12px` |
| Fonte | Inter (400–800) |
