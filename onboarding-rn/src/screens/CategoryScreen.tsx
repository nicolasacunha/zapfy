import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { BusinessCategory, useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

type Option = { id: Exclude<BusinessCategory, null>; emoji: string; label: string };

const OPTIONS: Option[] = [
  { id: 'fisico', emoji: '📦', label: 'Produto físico' },
  { id: 'servico', emoji: '🛠️', label: 'Serviço' },
  { id: 'digital', emoji: '💻', label: 'Digital' },
  { id: 'indefinido', emoji: '🤔', label: 'Ainda não sei' },
];

// TELA 5 — O que você vai vender? (grid 2x2)
export default function CategoryScreen({ onNext }: ScreenProps) {
  const { category, setCategory } = useOnboarding();

  return (
    <ScreenShell footer={<PrimaryButton label="Continuar" disabled={category === null} onPress={onNext} />}>
      <Text style={[text.headline, styles.headline]}>O que seu negócio vai vender?</Text>
      <View style={styles.grid}>
        {OPTIONS.map((option) => {
          const selected = category === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => setCategory(option.id)}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
              <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 32, marginBottom: 28 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: 26,
    alignItems: 'center',
    gap: 10,
  },
  cardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldTint,
  },
  emoji: { fontSize: 32 },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: font.medium,
  },
  labelSelected: { color: colors.goldLight },
});
