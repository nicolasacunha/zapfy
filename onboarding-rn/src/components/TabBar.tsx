import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font } from '../theme';

export type Tab = 'home' | 'missions' | 'business';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Início' },
  { id: 'missions', icon: '⚡', label: 'Missões' },
  { id: 'business', icon: '📈', label: 'Negócio' },
];

type Props = { active: Tab; onNavigate: (tab: Tab) => void };

export default function TabBar({ active, onNavigate }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable key={tab.id} style={styles.tab} onPress={() => onNavigate(tab.id)}>
            <Text style={[styles.icon, !isActive && styles.iconInactive]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.surface2,
    backgroundColor: colors.background,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { fontSize: 19 },
  iconInactive: { opacity: 0.45 },
  label: { fontFamily: font.medium, fontSize: 11, color: colors.textSecondary },
  labelActive: { color: colors.gold },
});
