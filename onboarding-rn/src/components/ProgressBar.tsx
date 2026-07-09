import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export default function ProgressBar({ progress }: { progress: number }) {
  const anim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false, // anima width (layout)
    }).start();
  }, [progress, anim]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: colors.surface2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
});
