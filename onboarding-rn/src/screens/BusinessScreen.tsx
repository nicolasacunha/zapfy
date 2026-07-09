import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar, { Tab } from '../components/TabBar';
import { MODULE1_MISSIONS } from '../data/missions';
import { BusinessCategory, useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius } from '../theme';

const CATEGORY_LABEL: Record<Exclude<BusinessCategory, null>, string> = {
  fisico: '📦 Produto físico',
  servico: '🛠️ Serviço',
  digital: '💻 Digital',
  indefinido: '🤔 Decidindo o que vender',
};

type Props = {
  onNavigate: (tab: Tab) => void;
  onPaywall: () => void;
  onParentReport: () => void;
};

export default function BusinessScreen({ onNavigate, onPaywall, onParentReport }: Props) {
  const insets = useSafeAreaInsets();
  const { companyName, category, zapCoins, completedMissions, proofs } = useOnboarding();
  const company = companyName.trim() || 'Sua empresa';
  const done = completedMissions.length;

  const stats = [
    { label: 'Provas reais', value: `📎 ${proofs.length}` },
    { label: 'Missões', value: `${done}/${MODULE1_MISSIONS.length}` },
    { label: 'ZapCoins', value: `🪙 ${zapCoins}` },
    { label: 'Módulo', value: '1 de 5' },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seu negócio</Text>

        <View style={styles.companyCard}>
          <Text style={styles.companyName}>{company}</Text>
          <Text style={styles.companyCategory}>{category ? CATEGORY_LABEL[category] : '—'}</Text>
        </View>

        <View style={styles.grid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.salesCard}>
          <Text style={styles.salesEmoji}>💰</Text>
          <Text style={styles.salesTitle}>Suas vendas aparecem aqui</Text>
          <Text style={styles.salesSub}>
            No Módulo 4 — Primeira venda, você registra dinheiro de verdade entrando na {company}.
          </Text>
          <Pressable onPress={onPaywall} style={styles.salesButton}>
            <Text style={styles.salesButtonText}>🔒 Desbloquear jornada completa</Text>
          </Pressable>
        </View>

        <Pressable onPress={onParentReport} style={styles.parentCard}>
          <Text style={styles.parentIcon}>👨‍👩‍👧</Text>
          <View style={styles.flex}>
            <Text style={styles.parentTitle}>Relatório do responsável</Text>
            <Text style={styles.parentSub}>Progresso em fatos do mundo real — não em moedas.</Text>
          </View>
          <Text style={styles.parentArrow}>›</Text>
        </Pressable>
      </ScrollView>
      <TabBar active="business" onNavigate={onNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 24 },
  title: {
    fontFamily: font.bold,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 18,
  },
  companyCard: {
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.gold,
    padding: 20,
  },
  companyName: { fontFamily: font.bold, fontSize: 22, color: colors.gold, letterSpacing: -0.4 },
  companyCategory: { fontFamily: font.medium, fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  stat: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 16,
  },
  statLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  statValue: { fontFamily: font.bold, fontSize: 20, color: colors.textPrimary, marginTop: 4 },
  salesCard: {
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 22,
    marginTop: 14,
    alignItems: 'center',
  },
  salesEmoji: { fontSize: 30 },
  salesTitle: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary, marginTop: 10 },
  salesSub: {
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  salesButton: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 14,
  },
  salesButtonText: { fontFamily: font.semibold, fontSize: 13, color: colors.goldLight },
  parentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 14,
  },
  parentIcon: { fontSize: 20 },
  parentTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  parentSub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  parentArrow: { fontFamily: font.medium, fontSize: 22, color: colors.textSecondary },
});
