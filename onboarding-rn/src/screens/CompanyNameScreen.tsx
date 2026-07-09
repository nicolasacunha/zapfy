import React, { useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius, text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

// TELA 4 — Nome da empresa
export default function CompanyNameScreen({ onNext }: ScreenProps) {
  const { childName, companyName, setCompanyName } = useOnboarding();
  const [focused, setFocused] = useState(false);
  const canContinue = companyName.trim().length > 0;

  const firstName = childName.trim().split(' ')[0];
  const placeholder = firstName ? `Ex: ${firstName}'s Store` : "Ex: Pedro's Store";

  const handleNext = () => {
    Keyboard.dismiss();
    onNext();
  };

  return (
    <ScreenShell
      keyboardAvoiding
      footer={<PrimaryButton label="Continuar" disabled={!canContinue} onPress={handleNext} />}
    >
      <Text style={[text.headline, styles.headline]}>Seu negócio precisa de um nome.</Text>
      <Text style={[text.sub, styles.sub]}>Pode mudar depois. Por agora, qualquer coisa serve.</Text>
      <TextInput
        value={companyName}
        onChangeText={setCompanyName}
        placeholder={placeholder}
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
  headline: { marginTop: 32 },
  sub: { marginTop: 10, marginBottom: 24 },
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
