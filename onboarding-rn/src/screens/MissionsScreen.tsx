import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar, { Tab } from '../components/TabBar';
import { MODULE1_MISSIONS, MODULE1_NAME } from '../data/missions';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius } from '../theme';

type Props = {
  onOpenMission: (id: number) => void;
  onNavigate: (tab: Tab) => void;
  onPaywall: () => void;
};

export default function MissionsScreen({ onOpenMission, onNavigate, onPaywall }: Props) {
  const insets = useSafeAreaInsets();
  const { completedMissions, missionAvailableToday } = useOnboarding();
  const nextId = completedMissions.length + 1;
  const moduleDone = completedMissions.length >= MODULE1_MISSIONS.length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Missões</Text>
        <Text style={styles.subtitle}>Módulo 1 • {MODULE1_NAME}</Text>

        <View style={styles.list}>
          {MODULE1_MISSIONS.map((mission) => {
            const done = completedMissions.includes(mission.id);
            const isNext = !done && mission.id === nextId;
            const available = isNext && missionAvailableToday;
            const waitingTomorrow = isNext && !missionAvailableToday;
            const locked = !done && !isNext;
            return (
              <Pressable
                key={mission.id}
                disabled={!available}
                onPress={() => onOpenMission(mission.id)}
                style={[styles.card, available && styles.cardActive, locked && styles.cardLocked]}
              >
                <View style={[styles.badge, done && styles.badgeDone, available && styles.badgeActive]}>
                  <Text
                    style={[styles.badgeText, done && styles.badgeTextDone, available && styles.badgeTextActive]}
                  >
                    {done ? '✓' : locked ? '🔒' : waitingTomorrow ? '🕒' : mission.id}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.cardTitle, locked && styles.cardTitleLocked]}>{mission.title}</Text>
                  <Text style={styles.cardMeta}>
                    {done
                      ? 'Concluída'
                      : locked
                        ? `Dia ${mission.day}`
                        : waitingTomorrow
                          ? 'Amanhã — missão de hoje feita ✓'
                          : `Hoje • até +${mission.reward + mission.proof.bonus} ZapCoins`}
                  </Text>
                </View>
                {available && <Text style={styles.go}>▶</Text>}
              </Pressable>
            );
          })}
        </View>

        {moduleDone && (
          <Pressable onPress={onPaywall} style={styles.nextModule}>
            <Text style={styles.nextModuleTitle}>Módulo 1 completo! 🏁</Text>
            <Text style={styles.nextModuleSub}>O Módulo 2 — Marca te espera. Toque pra desbloquear.</Text>
          </Pressable>
        )}
      </ScrollView>
      <TabBar active="missions" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontFamily: font.bold, fontSize: 24, color: colors.textPrimary, letterSpacing: -0.4 },
  subtitle: { fontFamily: font.medium, fontSize: 14, color: colors.gold, marginTop: 2, marginBottom: 20 },
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
  },
  cardActive: { borderColor: colors.gold },
  cardLocked: { opacity: 0.55 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: { backgroundColor: colors.goldTint },
  badgeActive: { backgroundColor: colors.gold },
  badgeText: { fontFamily: font.bold, fontSize: 15, color: colors.textSecondary },
  badgeTextDone: { color: colors.goldLight },
  badgeTextActive: { color: colors.onGold },
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary },
  cardTitleLocked: { color: colors.textSecondary },
  cardMeta: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  go: { color: colors.gold, fontSize: 16 },
  nextModule: {
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radius.md,
    padding: 18,
    marginTop: 16,
    alignItems: 'center',
  },
  nextModuleTitle: { fontFamily: font.bold, fontSize: 16, color: colors.goldLight },
  nextModuleSub: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
