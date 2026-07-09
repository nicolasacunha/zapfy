import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ScreenShell from '../components/ScreenShell';
import Zappy from '../components/Zappy';
import { text } from '../theme';
import type { ScreenProps } from '../OnboardingFlow';

// TELA 6 — Apresentação do Zappy
export default function ZappyIntroScreen({ onNext }: ScreenProps) {
  return (
    <ScreenShell footer={<PrimaryButton label="Boa, vamos nessa" onPress={onNext} />}>
      <View style={styles.center}>
        <Zappy size={150} pose="waving" />
        <Text style={[text.headline, styles.headline]}>Oi, eu sou o Zappy.</Text>
        <Text style={[text.sub, styles.body]}>
          Vou ser seu sócio nessa jornada. Te mando missões, te conto o que tá funcionando, e nunca te
          deixo travar.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headline: { marginTop: 32, textAlign: 'center' },
  body: { marginTop: 12, textAlign: 'center', paddingHorizontal: 8 },
});
