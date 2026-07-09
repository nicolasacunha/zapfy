import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import PrimaryButton from '../components/PrimaryButton';
import { Mission } from '../data/missions';
import { colors, font, radius } from '../theme';

/** Vídeos educativos do Zappy por missão (pipeline: edge-tts pt-BR → Wan 2.7 lip sync). */
export const MISSION_VIDEOS: Record<number, ReturnType<typeof require>> = {
  1: require('../../assets/videos/missao-1.mp4'),
  2: require('../../assets/videos/missao-2.mp4'),
  3: require('../../assets/videos/missao-3.mp4'),
  4: require('../../assets/videos/missao-4.mp4'),
  5: require('../../assets/videos/missao-5.mp4'),
};

export const hasIntroVideo = (id: number) => Boolean(MISSION_VIDEOS[id]);

type Props = { mission: Mission; onContinue: () => void; onBack: () => void };

/**
 * Vídeo do Zappy antes da missão: ~30s de contexto, depois ação no mundo real.
 * Pulável após 3s — autonomia em vez de obrigação; a missão nunca depende do vídeo.
 */
export default function MissionIntroScreen({ mission, onContinue, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [canSkip, setCanSkip] = useState(false);

  const player = useVideoPlayer(MISSION_VIDEOS[mission.id], (p) => {
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    const timer = setTimeout(() => setCanSkip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTag}>ZAPPY EXPLICA</Text>
        {canSkip ? (
          <Pressable onPress={onContinue} hitSlop={12}>
            <Text style={styles.skip}>Pular →</Text>
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
      </View>

      <View style={styles.videoWrap}>
        <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
      </View>

      <View style={styles.info}>
        <Text style={styles.missionTag}>MISSÃO {mission.id}</Text>
        <Text style={styles.missionTitle}>{mission.title}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <PrimaryButton label="Partiu missão" onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  back: { width: 44, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  backIcon: { color: colors.textSecondary, fontSize: 20, fontFamily: font.medium },
  headerTag: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1, color: colors.gold },
  skip: { fontFamily: font.semibold, fontSize: 13, color: colors.textSecondary },
  videoWrap: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface1,
  },
  video: { flex: 1 },
  info: { paddingHorizontal: 24, paddingTop: 14 },
  missionTag: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1, color: colors.gold },
  missionTitle: {
    fontFamily: font.bold,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginTop: 4,
  },
  footer: { paddingHorizontal: 24, paddingTop: 14 },
});
