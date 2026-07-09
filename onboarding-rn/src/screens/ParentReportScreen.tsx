import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { MODULE1_MISSIONS } from '../data/missions';
import { exportEvents, track } from '../lib/analytics';
import { useOnboarding } from '../store/OnboardingContext';
import { colors, font, radius } from '../theme';

type Props = { onBack: () => void; onPaywall: () => void };

/**
 * Relatório do responsável — progresso em FATOS do mundo real, não em moedas.
 * É isso que sustenta a assinatura: "ela fez", não "ela tem X coins".
 */
export default function ParentReportScreen({ onBack, onPaywall }: Props) {
  const insets = useSafeAreaInsets();
  const { childName, companyName, completedMissions, proofs, proofImages } = useOnboarding();
  const name = childName.trim().split(' ')[0] || 'Seu filho';
  const company = companyName.trim() || 'a empresa';
  const done = MODULE1_MISSIONS.filter((m) => completedMissions.includes(m.id));

  useEffect(() => {
    track('parent_report_view');
  }, []);

  // dados do piloto: eventos locais compartilháveis (sem backend)
  const exportPilotData = async () => {
    const data = await exportEvents();
    await Share.share({ message: data, title: 'Zapfy — dados do piloto' }).catch(() => {});
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTag}>RELATÓRIO DO RESPONSÁVEL</Text>
        <View style={styles.back} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>O progresso real de {name}.</Text>
        <Text style={styles.subtitle}>
          Medimos o que aconteceu no mundo real — não moedas ou tempo de tela.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summary}>
            <Text style={styles.summaryValue}>{done.length}/5</Text>
            <Text style={styles.summaryLabel}>missões do Módulo 1</Text>
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryValue}>{proofs.length}</Text>
            <Text style={styles.summaryLabel}>provas reais enviadas</Text>
          </View>
        </View>

        {done.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {name} ainda não concluiu missões. A primeira leva ~10 minutos — e acontece fora da tela.
            </Text>
          </View>
        ) : (
          <View style={styles.facts}>
            {done.map((mission) => {
              const withProof = proofs.includes(mission.id);
              const photo = proofImages[mission.id];
              return (
                <View key={mission.id} style={styles.fact}>
                  <Text style={styles.factIcon}>{withProof ? '📎' : '✓'}</Text>
                  <View style={styles.flex}>
                    <Text style={styles.factTitle}>{mission.title}</Text>
                    <Text style={[styles.factMeta, withProof && styles.factMetaProof]}>
                      {withProof ? 'Com prova do mundo real' : 'Auto-declarada (sem prova)'}
                    </Text>
                  </View>
                  {photo ? <Image source={{ uri: photo }} style={styles.factPhoto} /> : null}
                </View>
              );
            })}
          </View>
        )}

        <Text style={styles.next}>
          Próximo marco: no Módulo 4, {name} faz a primeira venda real da {company} — com dinheiro de
          verdade registrado aqui.
        </Text>

        <Pressable onPress={exportPilotData} hitSlop={8} style={styles.export}>
          <Text style={styles.exportText}>Exportar dados do piloto</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <PrimaryButton label="Liberar a jornada completa" onPress={onPaywall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 44,
  },
  back: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: colors.textSecondary, fontSize: 20, fontFamily: font.medium },
  headerTag: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 1, color: colors.gold },
  content: { paddingHorizontal: 24, paddingBottom: 16 },
  title: {
    fontFamily: font.bold,
    fontSize: 25,
    lineHeight: 31,
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginTop: 10,
  },
  subtitle: { fontFamily: font.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginTop: 8 },
  summaryRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  summary: {
    flex: 1,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 16,
  },
  summaryValue: { fontFamily: font.bold, fontSize: 24, color: colors.gold },
  summaryLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  empty: {
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 18,
    marginTop: 14,
  },
  emptyText: { fontFamily: font.regular, fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  facts: { gap: 10, marginTop: 14 },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface1,
    borderRadius: radius.md,
    padding: 15,
  },
  factIcon: { fontSize: 16 },
  factTitle: { fontFamily: font.semibold, fontSize: 14, color: colors.textPrimary },
  factMeta: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  factMetaProof: { color: colors.goldLight },
  factPhoto: { width: 42, height: 42, borderRadius: 8, backgroundColor: colors.surface2 },
  export: { alignSelf: 'center', padding: 8, marginTop: 10 },
  exportText: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary, textDecorationLine: 'underline' },
  next: {
    fontFamily: font.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: 18,
  },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
