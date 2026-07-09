import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { colors, font, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

// TELA 1 — Splash/Boas-vindas
export default function SplashScreen({ onNext }: ScreenProps) {
  return (
    <ScreenShell footer={<PrimaryButton label="Começar" onPress={onNext} />}>
      <View style={styles.center}>
        <View style={styles.badge}>
          <Text style={styles.bolt}>⚡</Text>
        </View>
        <Text style={styles.logo}>Zapfy</Text>
        <Text style={[text.sub, styles.tagline]}>Seu negócio começa aqui.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  bolt: { fontSize: 34 },
  logo: {
    fontFamily: font.extrabold,
    fontSize: 46,
    color: colors.gold,
    letterSpacing: -1.2,
  },
  tagline: { marginTop: 8, fontSize: 17 },
});
