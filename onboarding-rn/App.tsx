import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { OnboardingProvider, useOnboarding } from './src/store/OnboardingContext';
import OnboardingFlow from './src/OnboardingFlow';
import HomeScreen from './src/screens/HomeScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import MissionScreen from './src/screens/MissionScreen';
import MissionIntroScreen, { hasIntroVideo } from './src/screens/MissionIntroScreen';
import BusinessScreen from './src/screens/BusinessScreen';
import ParentReportScreen from './src/screens/ParentReportScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import { MODULE1_MISSIONS } from './src/data/missions';
import { Tab } from './src/components/TabBar';
import { track } from './src/lib/analytics';
import { colors } from './src/theme';

type Route =
  | { name: 'onboarding' }
  | { name: 'home' }
  | { name: 'missions' }
  | { name: 'business' }
  | { name: 'intro'; id: number }
  | { name: 'mission'; id: number }
  | { name: 'parent' }
  | { name: 'paywall'; from: Tab | 'parent' };

function Root() {
  const { hydrated, onboarded } = useOnboarding();
  const [route, setRoute] = useState<Route | null>(null);

  // rota inicial só depois de restaurar o estado: quem já fez onboarding cai na Home
  useEffect(() => {
    if (hydrated && route === null) {
      setRoute(onboarded ? { name: 'home' } : { name: 'onboarding' });
    }
  }, [hydrated, onboarded, route]);

  if (!route) {
    return <View style={styles.loading} />;
  }

  const goTab = (tab: Tab) => setRoute({ name: tab } as Route);
  // vídeo do Zappy antes da missão, quando existir
  const openMission = (id: number) =>
    setRoute(hasIntroVideo(id) ? { name: 'intro', id } : { name: 'mission', id });

  switch (route.name) {
    case 'onboarding':
      return (
        <OnboardingFlow
          onComplete={() => {
            track('onboarding_complete');
            setRoute({ name: 'home' });
          }}
        />
      );
    case 'intro': {
      const mission = MODULE1_MISSIONS.find((m) => m.id === route.id) ?? MODULE1_MISSIONS[0];
      return (
        <MissionIntroScreen
          mission={mission}
          onContinue={() => setRoute({ name: 'mission', id: mission.id })}
          onBack={() => setRoute({ name: 'home' })}
        />
      );
    }
    case 'mission': {
      const mission = MODULE1_MISSIONS.find((m) => m.id === route.id) ?? MODULE1_MISSIONS[0];
      return (
        <MissionScreen
          mission={mission}
          onBack={() => setRoute({ name: 'home' })}
          onFinish={() => setRoute({ name: 'home' })}
        />
      );
    }
    case 'missions':
      return (
        <MissionsScreen
          onOpenMission={openMission}
          onNavigate={goTab}
          onPaywall={() => setRoute({ name: 'paywall', from: 'missions' })}
        />
      );
    case 'business':
      return (
        <BusinessScreen
          onNavigate={goTab}
          onPaywall={() => setRoute({ name: 'paywall', from: 'business' })}
          onParentReport={() => setRoute({ name: 'parent' })}
        />
      );
    case 'parent':
      return (
        <ParentReportScreen
          onBack={() => setRoute({ name: 'business' })}
          onPaywall={() => setRoute({ name: 'paywall', from: 'parent' })}
        />
      );
    case 'paywall':
      return <PaywallScreen onClose={() => setRoute({ name: route.from } as Route)} />;
    default:
      return (
        <HomeScreen
          onStartMission={openMission}
          onNavigate={goTab}
          onPaywall={() => setRoute({ name: 'paywall', from: 'home' })}
        />
      );
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <StatusBar style="light" />
        <Root />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.background },
});
