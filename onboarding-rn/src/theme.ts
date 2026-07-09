import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0A0A0A',
  surface1: '#141414',
  surface2: '#1C1C1C',
  gold: '#C9A84C',
  goldLight: '#E2C06A',
  goldTint: 'rgba(201, 168, 76, 0.10)',
  goldBorder: 'rgba(201, 168, 76, 0.35)',
  textPrimary: '#EBEBEB',
  textSecondary: '#888888',
  onGold: '#0A0A0A',
  border: '#262626',
};

export const radius = {
  md: 12, // padrão do design system
  lg: 16,
  full: 999,
};

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};

export const text = StyleSheet.create({
  headline: {
    fontFamily: font.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: font.regular,
    fontSize: 16,
    lineHeight: 23,
    color: colors.textSecondary,
  },
});
