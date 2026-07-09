import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

const ITEMS = [
  { icon: '⚡', title: 'Missões diárias', desc: 'Pequenas, rápidas, do mundo real.' },
  { icon: '🪙', title: 'ZapCoins', desc: 'Ganhe completando missões.' },
  { icon: '📈', title: 'Seu negócio cresce', desc: 'Acompanhe tudo aqui.' },
];

// TELA 7 — Como funciona (3 itens)
export default function HowItWorksScreen({ onNext }: ScreenProps) {
  return (
    <ScreenShell footer={<PrimaryButton label="Entendi" onPress={onNext} />}>
      <Text style={[text.headline, styles.headline]}>Como o Zapfy funciona</Text>
      <View style={styles.list}>
        {ITEMS.map((item) => (
          <View key={item.title} style={styles.row}>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.texts}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 32, marginBottom: 28 },
  list: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  texts: { flex: 1 },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: font.semibold,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: font.regular,
    marginTop: 2,
  },
});
