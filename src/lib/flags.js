// Flags de configuração do app.
//
// PILOT_MODE: durante o piloto (Link School, ~12 crianças), o piloto é
// gratuito — o paywall e os upsells de assinatura ficam desativados pra não
// poluir a leitura de retenção. Pôr `false` reativa tudo pro lançamento.
export const PILOT_MODE = true

// Deriva o estado do paywall do modo piloto. No lançamento, basta PILOT_MODE = false.
export const PAYWALL_ENABLED = !PILOT_MODE
