import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Métricas do piloto — eventos locais, exportáveis pelo relatório do responsável.
 * Métrica-chave: % de crianças com ação no mundo real na 1ª semana (mission_complete withProof).
 * TODO (blocker #3): espelhar eventos no GA4/Meta Pixel quando os IDs reais existirem.
 */
const EVENTS_KEY = 'zapfy:events:v1';
const MAX_EVENTS = 500;

export async function track(event: string, props: Record<string, unknown> = {}): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    const events: unknown[] = raw ? JSON.parse(raw) : [];
    events.push({ event, props, ts: new Date().toISOString() });
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // analytics nunca quebra o app
  }
}

export async function exportEvents(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(EVENTS_KEY)) ?? '[]';
  } catch {
    return '[]';
  }
}
