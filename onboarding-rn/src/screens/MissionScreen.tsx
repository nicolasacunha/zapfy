import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import PrimaryButton from '../components/PrimaryButton';
import Zappy from '../components/Zappy';
import { Mission } from '../data/missions';
import { track } from '../lib/analytics';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius, text } from '../theme';

type Props = { mission: Mission; onBack: () => void; onFinish: () => void };

// Tela genérica de missão: passos checáveis + prova com foto real + recompensa
export default function MissionScreen({ mission, onBack, onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const { companyName, completeMission } = useOnboarding();
  const [checked, setChecked] = useState<boolean[]>(mission.steps.map(() => false));
  const [proofUri, setProofUri] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const allChecked = checked.every(Boolean);
  const proofAttached = proofUri !== null;
  const company = companyName.trim() || 'sua empresa';
  const totalCoins = mission.reward + (proofAttached ? mission.proof.bonus : 0);

  useEffect(() => {
    track('mission_start', { id: mission.id });
  }, [mission.id]);

  const toggle = (index: number) =>
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));

  // prova real: foto da galeria/câmera (fica no dispositivo — sem upload no piloto)
  const attachProof = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setProofUri(result.assets[0].uri);
      track('proof_attached', { id: mission.id });
    }
  };

  const finishMission = () => {
    completeMission(mission.id, totalCoins, proofUri);
    track('mission_complete', { id: mission.id, withProof: proofAttached, coins: totalCoins });
    setDone(true);
  };

  if (done) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
        <View style={styles.celebration}>
          <Zappy size={150} pose="celebrating" />
          <View style={styles.rewardRow}>
            <View style={styles.rewardPill}>
              <Text style={styles.rewardText}>+{mission.reward} ZapCoins</Text>
            </View>
            {proofAttached && (
              <View style={[styles.rewardPill, styles.rewardPillProof]}>
                <Text style={[styles.rewardText, styles.rewardTextProof]}>
                  +{mission.proof.bonus} prova real 🔥
                </Text>
              </View>
            )}
          </View>
          <Text style={[text.headline, styles.celebrationTitle]}>Missão concluída!</Text>
          <Text style={[text.sub, styles.celebrationSub]}>
            {proofAttached
              ? `Prova registrada — a ${company} tem fatos pra mostrar.`
              : `A ${company} deu mais um passo. Da próxima, manda a prova: vale ${mission.proof.bonus} coins.`}
          </Text>
        </View>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
          <PrimaryButton label="Voltar pro QG" onPress={onFinish} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTag}>MÓDULO 1 • MISSÃO {mission.id}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.zappyRow}>
          <Zappy size={76} pose="pointing" />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{mission.brief}</Text>
          </View>
        </View>

        <Text style={[text.headline, styles.title]}>{mission.title}</Text>

        <View style={styles.steps}>
          {mission.steps.map((step, index) => {
            const isChecked = checked[index];
            return (
              <Pressable
                key={step.title}
                onPress={() => toggle(index)}
                style={[styles.step, isChecked && styles.stepChecked]}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.stepTitle, isChecked && styles.stepTitleChecked]}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={attachProof} style={[styles.proofCard, proofAttached && styles.proofCardOn]}>
          {proofUri ? (
            <Image source={{ uri: proofUri }} style={styles.proofThumb} />
          ) : (
            <Text style={styles.proofIcon}>📸</Text>
          )}
          <View style={styles.flex}>
            <Text style={styles.proofTitle}>
              Prova do fundador <Text style={styles.proofBonus}>+{mission.proof.bonus} 🔥</Text>
            </Text>
            <Text style={styles.proofDesc}>{mission.proof.prompt}</Text>
          </View>
          <View style={[styles.proofButton, proofAttached && styles.proofButtonOn]}>
            <Text style={[styles.proofButtonText, proofAttached && styles.proofButtonTextOn]}>
              {proofAttached ? 'Anexada ✓' : 'Anexar'}
            </Text>
          </View>
        </Pressable>
        <Text style={styles.proofHint}>
          Prova real vale {Math.round(mission.proof.bonus / mission.reward)}x mais que marcar os passos.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <PrimaryButton
          label={`Concluir missão  ·  +${totalCoins}`}
          disabled={!allChecked}
          onPress={finishMission}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: colors.textSecondary, fontSize: 20, fontFamily: font.medium },
  headerTag: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1, color: colors.gold },
  content: { paddingHorizontal: 24, paddingBottom: 16 },
  zappyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  bubbleText: { fontFamily: font.medium, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  title: { fontSize: 26, lineHeight: 32, marginTop: 24, marginBottom: 20 },
  steps: { gap: 12 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
  },
  stepChecked: { borderColor: colors.gold, backgroundColor: colors.goldTint },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkmark: { color: colors.onGold, fontSize: 14, fontFamily: font.bold },
  stepTitle: { fontFamily: font.semibold, fontSize: 15, lineHeight: 21, color: colors.textPrimary },
  stepTitleChecked: { color: colors.goldLight },
  stepDesc: { fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 3 },
  proofCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.goldBorder,
    borderStyle: 'dashed',
    padding: 16,
    marginTop: 16,
  },
  proofCardOn: { borderStyle: 'solid', borderColor: colors.gold, backgroundColor: colors.goldTint },
  proofIcon: { fontSize: 22 },
  proofThumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.surface2 },
  proofTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  proofBonus: { color: colors.goldLight, fontFamily: font.bold },
  proofDesc: { fontFamily: font.regular, fontSize: 12, lineHeight: 17, color: colors.textSecondary, marginTop: 3 },
  proofButton: {
    backgroundColor: colors.surface2,
    borderRadius: radius.full,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  proofButtonOn: { backgroundColor: colors.gold },
  proofButtonText: { fontFamily: font.semibold, fontSize: 12, color: colors.goldLight },
  proofButtonTextOn: { color: colors.onGold },
  proofHint: {
    fontFamily: font.regular,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  celebration: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  rewardRow: { flexDirection: 'row', gap: 8, marginTop: 24 },
  rewardPill: {
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rewardPillProof: { backgroundColor: colors.gold, borderColor: colors.gold },
  rewardText: { fontFamily: font.bold, fontSize: 15, color: colors.goldLight },
  rewardTextProof: { color: colors.onGold },
  celebrationTitle: { marginTop: 16, textAlign: 'center' },
  celebrationSub: { marginTop: 10, textAlign: 'center' },
});
