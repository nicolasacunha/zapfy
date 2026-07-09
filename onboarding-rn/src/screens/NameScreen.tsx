import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import Zappy from '../components/Zappy';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

// TELA 2 — Nome da criança
export default function NameScreen({ onNext }: ScreenProps) {
  const { childName, setChildName } = useOnboarding();
  const [focused, setFocused] = useState(false);
  const canContinue = childName.trim().length > 0;

  const handleNext = () => {
    Keyboard.dismiss();
    onNext();
  };

  return (
    <ScreenShell
      keyboardAvoiding
      footer={<PrimaryButton label="Continuar" disabled={!canContinue} onPress={handleNext} />}
    >
      <View style={styles.zappy}>
        <Zappy size={64} />
      </View>
      <Text style={[text.headline, styles.headline]}>Qual é o seu nome?</Text>
      <TextInput
        value={childName}
        onChangeText={setChildName}
        placeholder="Ex: Pedro"
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, focused && styles.inputFocused]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={() => canContinue && handleNext()}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  zappy: { alignItems: 'center', paddingTop: 8 },
  headline: { marginTop: 24, marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontFamily: font.medium,
    fontSize: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  inputFocused: { borderColor: colors.gold },
});
