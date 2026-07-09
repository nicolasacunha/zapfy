import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

const AGES = [8, 9, 10, 11, 12, 13, 14];

// TELA 3 — Idade (pills horizontais, não dropdown)
export default function AgeScreen({ onNext }: ScreenProps) {
  const { age, setAge } = useOnboarding();

  return (
    <ScreenShell footer={<PrimaryButton label="Continuar" disabled={age === null} onPress={onNext} />}>
      <Text style={[text.headline, styles.headline]}>Quantos anos você tem?</Text>
      <View style={styles.pillRow}>
        {AGES.map((value) => {
          const selected = age === value;
          return (
            <Pressable
              key={value}
              onPress={() => setAge(value)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{value}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 32, marginBottom: 28 },
  pillRow: { flexDirection: 'row', gap: 6 },
  pill: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.surface1,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 17,
    fontFamily: font.semibold,
  },
  pillTextSelected: { color: colors.onGold },
});
