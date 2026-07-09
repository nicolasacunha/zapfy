import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

const STORIES = [
  { quote: 'Vendi 3 brigadeiros no recreio depois da missão 4.', author: 'Ana, 11 anos' },
  { quote: 'Minha loja de slime já tem 12 pedidos.', author: 'Lucas, 10 anos' },
  { quote: 'Lavei 5 carros no condomínio no fim de semana.', author: 'Sofia, 13 anos' },
];

// TELA 8 — Social proof
export default function SocialProofScreen({ onNext }: ScreenProps) {
  return (
    <ScreenShell footer={<PrimaryButton label="Quero fazer igual" onPress={onNext} />}>
      <Text style={[text.headline, styles.headline]}>Crianças como você já estão construindo.</Text>
      <View style={styles.list}>
        {STORIES.map((story) => (
          <View key={story.author} style={styles.card}>
            <Text style={styles.quote}>“{story.quote}”</Text>
            <Text style={styles.author}>{story.author}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headline: { marginTop: 32, marginBottom: 24 },
  list: { gap: 12 },
  card: {
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    padding: 16,
  },
  quote: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: font.regular,
  },
  author: {
    color: colors.gold,
    fontSize: 13,
    fontFamily: font.semibold,
    marginTop: 10,
  },
});
