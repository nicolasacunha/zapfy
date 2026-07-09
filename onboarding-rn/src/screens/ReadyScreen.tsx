import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import Zappy from '../components/Zappy';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

// TELA 9 — Tudo pronto (botão navega para o Home via onNext → onComplete)
export default function ReadyScreen({ onNext }: ScreenProps) {
  const { childName, companyName } = useOnboarding();
  const name = childName.trim().split(' ')[0] || 'Fundador';
  const company = companyName.trim() || 'sua empresa';

  return (
    <ScreenShell footer={<PrimaryButton label="Ver minha primeira missão" onPress={onNext} />}>
      <View style={styles.center}>
        <Zappy size={150} pose="celebrating" />
        <Text style={[text.headline, styles.headline]}>
          {name}, a <Text style={styles.company}>{company}</Text> acabou de nascer.
        </Text>
        <Text style={[text.sub, styles.sub]}>Sua primeira missão te espera.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headline: { marginTop: 32, textAlign: 'center' },
  company: { color: colors.gold },
  sub: { marginTop: 12, textAlign: 'center' },
});
