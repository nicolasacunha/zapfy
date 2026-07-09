import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProgressBar from './components/ProgressBar';
import { colors, font } from './theme';
import SplashScreen from './screens/SplashScreen';
import NameScreen from './screens/NameScreen';
import AgeScreen from './screens/AgeScreen';
import CompanyNameScreen from './screens/CompanyNameScreen';
import CategoryScreen from './screens/CategoryScreen';
import ZappyIntroScreen from './screens/ZappyIntroScreen';
import HowItWorksScreen from './screens/HowItWorksScreen';
import SocialProofScreen from './screens/SocialProofScreen';
import ReadyScreen from './screens/ReadyScreen';

export type ScreenProps = { onNext: () => void };

const SCREENS: React.ComponentType<ScreenProps>[] = [
  SplashScreen,
  NameScreen,
  AgeScreen,
  CompanyNameScreen,
  CategoryScreen,
  ZappyIntroScreen,
  HowItWorksScreen,
  SocialProofScreen,
  ReadyScreen,
];

const TOTAL = SCREENS.length;
const SLIDE = 28; // deslocamento horizontal da transição

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const anim = useRef(new Animated.Value(1)).current;
  const animating = useRef(false);

  const goTo = (nextStep: number, dir: 1 | -1) => {
    if (animating.current) return;
    animating.current = true;
    setDirection(dir);
    setPhase('out');
    // fade + slide de saída
    Animated.timing(anim, {
      toValue: 0,
      duration: 130,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      setPhase('in');
      // fade + slide de entrada
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        animating.current = false;
      });
    });
  };

  const handleNext = () => {
    if (step === TOTAL - 1) {
      onComplete(); // tela 9 → Home
      return;
    }
    goTo(step + 1, 1);
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1, -1);
  };

  const CurrentScreen = SCREENS[step];

  // fase "out": desliza para o lado oposto; fase "in": entra vindo da direção do avanço
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [phase === 'in' ? SLIDE * direction : -SLIDE * direction, 0],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <ProgressBar progress={(step + 1) / TOTAL} />
        <View style={styles.backRow}>
          {step > 0 ? (
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
        </View>
      </View>

      <Animated.View style={[styles.screen, { opacity: anim, transform: [{ translateX }] }]}>
        <CurrentScreen onNext={handleNext} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24 },
  backRow: { height: 40, justifyContent: 'center', marginTop: 6, marginHorizontal: -8 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backPressed: { opacity: 0.6 },
  backIcon: { color: colors.textSecondary, fontSize: 20, fontFamily: font.medium },
  screen: { flex: 1 },
});
