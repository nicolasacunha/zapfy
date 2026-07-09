import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import JourneyPath from '../components/JourneyPath';
import PrimaryButton from '../components/PrimaryButton';
import TabBar, { Tab } from '../components/TabBar';
import Zappy from '../components/Zappy';
import { MODULE1_MISSIONS } from '../data/missions';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius } from '../theme';

const MODULES = [
  { n: 1, name: 'Ideia' },
  { n: 2, name: 'Marca' },
  { n: 3, name: 'Produto' },
  { n: 4, name: 'Primeira venda' },
  { n: 5, name: 'Crescimento' },
];

type Props = {
  onStartMission: (id: number) => void;
  onNavigate: (tab: Tab) => void;
  onPaywall: () => void;
};

export default function HomeScreen({ onStartMission, onNavigate, onPaywall }: Props) {
  const insets = useSafeAreaInsets();
  const { childName, companyName, zapCoins, completedMissions, missionAvailableToday } = useOnboarding();
  const name = childName.trim().split(' ')[0] || 'Fundador';
  const company = companyName.trim() || 'Sua empresa';
  const done = completedMissions.length;
  const moduleDone = done >= MODULE1_MISSIONS.length;
  const nextMission = MODULE1_MISSIONS[Math.min(done, MODULE1_MISSIONS.length - 1)];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.flex}>
            <Text style={styles.hello}>Fala, {name}!</Text>
            <Text style={styles.company}>{company}</Text>
          </View>
          <View style={styles.coins}>
            <Text style={styles.coinsIcon}>🪙</Text>
            <Text style={styles.coinsValue}>{zapCoins}</Text>
          </View>
        </View>

        {moduleDone ? (
          <View style={styles.missionCard}>
            <View style={styles.flex}>
              <Text style={styles.missionTag}>MÓDULO 1 COMPLETO 🏁</Text>
              <Text style={styles.missionTitle}>A {company} tem um plano.</Text>
              <Text style={styles.missionMeta}>O Módulo 2 — Marca te espera.</Text>
            </View>
            <Zappy size={88} pose="celebrating" />
          </View>
        ) : !missionAvailableToday ? (
          <View style={styles.missionCard}>
            <View style={styles.flex}>
              <Text style={styles.missionTag}>MISSÃO DE AMANHÃ</Text>
              <Text style={styles.missionTitle}>{nextMission.title}</Text>
              <Text style={styles.missionMeta}>
                Missão de hoje feita ✓ — negócio bom cresce todo dia.
              </Text>
            </View>
            <Zappy size={88} pose="thinking" />
          </View>
        ) : (
          <View style={styles.missionCard}>
            <View style={styles.flex}>
              <Text style={styles.missionTag}>
                MISSÃO {nextMission.id} • MÓDULO 1
              </Text>
              <Text style={styles.missionTitle}>{nextMission.title}</Text>
              <Text style={styles.missionMeta}>
                ⏱ ~10 min  •  até +{nextMission.reward + nextMission.proof.bonus} ZapCoins
              </Text>
            </View>
            <Zappy size={88} pose="pointing" />
          </View>
        )}

        {moduleDone ? (
          <PrimaryButton label="Desbloquear Módulo 2" onPress={onPaywall} />
        ) : !missionAvailableToday ? (
          <PrimaryButton label="Disponível amanhã" disabled onPress={() => {}} />
        ) : (
          <PrimaryButton label="Começar missão" onPress={() => onStartMission(nextMission.id)} />
        )}

        <Text style={styles.sectionTitle}>Sua jornada de fundador</Text>
        <JourneyPath
          modules={MODULES}
          activeIndex={0}
          activeDone={moduleDone}
          progressLabel={`${done}/${MODULE1_MISSIONS.length}`}
          onLockedPress={onPaywall}
        />
      </ScrollView>

      <TabBar active="home" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hello: {
    fontFamily: font.bold,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  company: { fontFamily: font.medium, fontSize: 14, color: colors.gold, marginTop: 2 },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface1,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  coinsIcon: { fontSize: 15 },
  coinsValue: { fontFamily: font.semibold, fontSize: 15, color: colors.goldLight },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gold,
    padding: 18,
    marginTop: 24,
    marginBottom: 14,
  },
  missionTag: {
    fontFamily: font.semibold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.gold,
  },
  missionTitle: {
    fontFamily: font.bold,
    fontSize: 20,
    lineHeight: 25,
    color: colors.textPrimary,
    marginTop: 6,
  },
  missionMeta: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  sectionTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 28,
    marginBottom: 14,
  },
});
