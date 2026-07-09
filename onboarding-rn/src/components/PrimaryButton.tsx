import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, font, radius } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({ label, onPress, disabled = false, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colors.goldLight,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: colors.surface2,
  },
  label: {
    color: colors.onGold,
    fontSize: 17,
    fontFamily: font.semibold,
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
});
