import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { track } from '../lib/analytics';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius } from '../theme';

const MODULES = [
  { n: 1, name: 'Ideia', detail: 'Encontrar o que vender', free: true },
  { n: 2, name: 'Marca', detail: 'Nome, identidade e história' },
  { n: 3, name: 'Produto', detail: 'Construir a oferta real' },
  { n: 4, name: 'Primeira venda', detail: 'Dinheiro de verdade entrando' },
  { n: 5, name: 'Crescimento', detail: 'Lucro, meta e expansão' },
];

type Plan = 'yearly' | 'monthly';

type Props = { onClose: () => void };

/**
 * Paywall — copy escrita para o PAI (quem paga), com handoff da criança no topo.
 * TODO: integrar RevenueCat com chave real (blocker #1) — hoje o CTA é stub.
 */
export default function PaywallScreen({ onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { childName, companyName } = useOnboarding();
  const [plan, setPlan] = useState<Plan>('yearly');
  const name = childName.trim().split(' ')[0] || 'Seu filho';
  const company = companyName.trim() || 'a empresa dele';

  useEffect(() => {
    track('paywall_view');
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.handoff}>
          <Text style={styles.handoffText}>📲 Mostra essa tela pro seu responsável</Text>
        </View>

        <Text style={styles.title}>{name} acabou de virar fundador.</Text>
        <Text style={styles.subtitle}>
          O Módulo 1 foi grátis. A jornada completa transforma a {company} em um negócio de verdade —
          com marca, produto e a primeira venda real.
        </Text>

        <View style={styles.modules}>
          {MODULES.map((mod) => (
            <View key={mod.n} style={styles.moduleRow}>
              <Text style={styles.moduleIcon}>{mod.free ? '✅' : '🔒'}</Text>
              <View style={styles.flex}>
                <Text style={styles.moduleName}>
                  Módulo {mod.n} — {mod.name}
                  {mod.free ? '  ·  grátis' : ''}
                </Text>
                <Text style={styles.moduleDetail}>{mod.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          <Pressable
            onPress={() => setPlan('yearly')}
            style={[styles.plan, plan === 'yearly' && styles.planSelected]}
          >
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>2 MESES GRÁTIS</Text>
            </View>
            <Text style={styles.planName}>Anual</Text>
            <Text style={styles.planPrice}>R$ 599<Text style={styles.planPeriod}>/ano</Text></Text>
            <Text style={styles.planNote}>equivale a R$ 49,90/mês</Text>
          </Pressable>
          <Pressable
            onPress={() => setPlan('monthly')}
            style={[styles.plan, plan === 'monthly' && styles.planSelected]}
          >
            <Text style={styles.planName}>Mensal</Text>
            <Text style={styles.planPrice}>R$ 69,90<Text style={styles.planPeriod}>/mês</Text></Text>
            <Text style={styles.planNote}>cancele quando quiser</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <PrimaryButton
          label="Liberar a jornada completa"
          onPress={() => {
            /* TODO: RevenueCat purchase(plan) — blocker #1 */
          }}
        />
        <Pressable onPress={onClose} hitSlop={8} style={styles.later}>
          <Text style={styles.laterText}>Agora não</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 12 },
  handoff: {
    backgroundColor: colors.surface2,
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 22,
  },
  handoffText: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary },
  title: {
    fontFamily: font.bold,
    fontSize: 27,
    lineHeight: 33,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: 10,
  },
  modules: { gap: 10, marginTop: 22 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moduleIcon: { fontSize: 16 },
  moduleName: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  moduleDetail: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  plans: { flexDirection: 'row', gap: 12, marginTop: 24 },
  plan: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 16,
    paddingTop: 18,
  },
  planSelected: { borderColor: colors.gold, backgroundColor: colors.goldTint },
  bestBadge: {
    position: 'absolute',
    top: -9,
    alignSelf: 'center',
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  bestBadgeText: { fontFamily: font.bold, fontSize: 9, letterSpacing: 0.5, color: colors.onGold },
  planName: { fontFamily: font.semibold, fontSize: 14, color: colors.textSecondary },
  planPrice: { fontFamily: font.bold, fontSize: 22, color: colors.textPrimary, marginTop: 6 },
  planPeriod: { fontFamily: font.medium, fontSize: 13, color: colors.textSecondary },
  planNote: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  footer: { paddingHorizontal: 24, paddingTop: 10 },
  later: { alignSelf: 'center', padding: 10, marginTop: 2 },
  laterText: { fontFamily: font.medium, fontSize: 14, color: colors.textSecondary },
});
