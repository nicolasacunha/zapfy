import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BusinessCategory = 'fisico' | 'servico' | 'digital' | 'indefinido' | null;

/**
 * Cadência do produto: 1 missão por dia (janela das 72h = ação diária, sem streak punitivo).
 * Coloque false para destravar em sequência (demos/testes do piloto).
 */
export const DAILY_GATE = true;

const STORAGE_KEY = 'zapfy:state:v1';

const todayStr = () => new Date().toISOString().slice(0, 10);

type OnboardingContextValue = {
  childName: string;
  age: number | null;
  companyName: string;
  category: BusinessCategory;
  setChildName: (value: string) => void;
  setAge: (value: number) => void;
  setCompanyName: (value: string) => void;
  setCategory: (value: BusinessCategory) => void;
  zapCoins: number;
  /** ids das missões concluídas (módulo 1) */
  completedMissions: number[];
  /** ids das missões concluídas COM prova do mundo real */
  proofs: number[];
  /** uri local da foto de prova por missão */
  proofImages: Record<number, string>;
  completeMission: (id: number, coins: number, proofUri: string | null) => void;
  /** false quando a missão do dia já foi feita (DAILY_GATE) */
  missionAvailableToday: boolean;
  /** estado restaurado do AsyncStorage */
  hydrated: boolean;
  /** onboarding já concluído em sessão anterior */
  onboarded: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>(null);
  const [zapCoins, setZapCoins] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [proofs, setProofs] = useState<number[]>([]);
  const [proofImages, setProofImages] = useState<Record<number, string>>({});
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  // restaura estado salvo
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          setChildName(s.childName ?? '');
          setAge(s.age ?? null);
          setCompanyName(s.companyName ?? '');
          setCategory(s.category ?? null);
          setZapCoins(s.zapCoins ?? 0);
          setCompletedMissions(s.completedMissions ?? []);
          setProofs(s.proofs ?? []);
          setProofImages(s.proofImages ?? {});
          setLastCompletionDate(s.lastCompletionDate ?? null);
          setOnboarded(Boolean((s.childName ?? '').trim()) && Boolean((s.companyName ?? '').trim()));
        }
      } catch {
        // estado corrompido: segue limpo
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // salva a cada mudança (após hidratar)
  useEffect(() => {
    if (!hydrated) return;
    const snapshot = JSON.stringify({
      childName,
      age,
      companyName,
      category,
      zapCoins,
      completedMissions,
      proofs,
      proofImages,
      lastCompletionDate,
    });
    AsyncStorage.setItem(STORAGE_KEY, snapshot).catch(() => {});
  }, [hydrated, childName, age, companyName, category, zapCoins, completedMissions, proofs, proofImages, lastCompletionDate]);

  const completeMission = (id: number, coins: number, proofUri: string | null) => {
    if (!completedMissions.includes(id)) {
      setZapCoins((c) => c + coins);
      setCompletedMissions((m) => [...m, id]);
      setLastCompletionDate(todayStr());
      if (proofUri) {
        setProofs((p) => [...p, id]);
        setProofImages((imgs) => ({ ...imgs, [id]: proofUri }));
      }
    }
  };

  const missionAvailableToday = !DAILY_GATE || lastCompletionDate !== todayStr();

  const value = useMemo(
    () => ({
      childName,
      age,
      companyName,
      category,
      setChildName,
      setAge,
      setCompanyName,
      setCategory,
      zapCoins,
      completedMissions,
      proofs,
      proofImages,
      completeMission,
      missionAvailableToday,
      hydrated,
      onboarded,
    }),
    [childName, age, companyName, category, zapCoins, completedMissions, proofs, proofImages, missionAvailableToday, hydrated, onboarded],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding deve ser usado dentro de <OnboardingProvider>');
  return ctx;
}
