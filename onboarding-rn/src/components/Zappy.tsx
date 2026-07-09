import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType } from 'react-native';

export type ZappyPose = 'neutral' | 'hero' | 'waving' | 'celebrating' | 'thinking' | 'pointing';

/**
 * Zappy — mascote oficial (artes geradas via Higgsfield a partir do turnaround do Zap Core).
 * PNGs transparentes em assets/zappy/, 512px, com flutuação sutil.
 */
const ART: Record<ZappyPose, ImageSourcePropType> = {
  neutral: require('../../assets/zappy/zappy-neutral.png'),
  hero: require('../../assets/zappy/zappy-hero.png'),
  waving: require('../../assets/zappy/zappy-waving.png'),
  celebrating: require('../../assets/zappy/zappy-celebrating.png'),
  thinking: require('../../assets/zappy/zappy-thinking.png'),
  pointing: require('../../assets/zappy/zappy-pointing.png'),
};

type Props = {
  size?: number;
  pose?: ZappyPose;
  float?: boolean;
};

export default function Zappy({ size = 96, pose = 'neutral', float = true }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!float) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, float]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.05] });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Image source={ART[pose]} style={{ width: size, height: size }} resizeMode="contain" />
    </Animated.View>
  );
}
