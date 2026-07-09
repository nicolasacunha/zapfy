import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Zappy from './Zappy';
import { colors, font, radius } from '../theme';

export type JourneyModule = { n: number; name: string };

const NODE = 62;
const SEG = 102; // distância vertical entre centros dos nós
const X_PATTERN = [0.5, 0.82, 0.5, 0.18, 0.5]; // trilha em zigue-zague

type Props = {
  modules: JourneyModule[];
  /** índice do módulo desbloqueado atual */
  activeIndex: number;
  /** módulo ativo 100% concluído (mostra ✓) */
  activeDone?: boolean;
  /** ex: "1/5" missões do módulo ativo */
  progressLabel: string;
  /** toque em módulo bloqueado (abre paywall) */
  onLockedPress?: () => void;
};

/**
 * Trilha de fases estilo mapa de jogo: nós em zigue-zague ligados por
 * pontinhos, cadeado nos bloqueados e Zappy parado no nó atual.
 */
export default function JourneyPath({
  modules,
  activeIndex,
  activeDone = false,
  progressLabel,
  onLockedPress,
}: Props) {
  const width = Dimensions.get('window').width - 48;
  const height = SEG * (modules.length - 1) + NODE + 52;
  const cx = (i: number) => X_PATTERN[i % X_PATTERN.length] * width;
  const cy = (i: number) => i * SEG + NODE / 2;

  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < modules.length - 1; i++) {
    for (let d = 1; d <= 3; d++) {
      const t = d / 4;
      dots.push({
        x: cx(i) + (cx(i + 1) - cx(i)) * t,
        y: cy(i) + (cy(i + 1) - cy(i)) * t,
      });
    }
  }

  return (
    <View style={{ width, height }}>
      {dots.map((dot, i) => (
        <View key={`d${i}`} style={[styles.dot, { left: dot.x - 4, top: dot.y - 4 }]} />
      ))}

      {modules.map((mod, i) => {
        const locked = i > activeIndex;
        const active = i === activeIndex;
        const x = cx(i);
        const y = cy(i);
        const nodeInner = (
          <>
            <View style={[styles.node, active && styles.nodeActive, locked && styles.nodeLocked]}>
              <Text style={[styles.nodeText, active && styles.nodeTextActive]}>
                {locked ? '🔒' : active && activeDone ? '✓' : mod.n}
              </Text>
            </View>
            <Text style={[styles.nodeName, active && styles.nodeNameActive]} numberOfLines={1}>
              {mod.name}
            </Text>
            {active && (
              <View style={styles.progressChip}>
                <Text style={styles.progressText}>{progressLabel}</Text>
              </View>
            )}
          </>
        );
        const nodeStyle = [styles.nodeWrap, { left: x - 55, top: y - NODE / 2 }] as const;
        return locked ? (
          <Pressable key={mod.n} onPress={onLockedPress} style={nodeStyle}>
            {nodeInner}
          </Pressable>
        ) : (
          <View key={mod.n} style={nodeStyle}>
            {nodeInner}
          </View>
        );
      })}

      <View
        style={{
          position: 'absolute',
          left: cx(activeIndex) + NODE / 2 + 10,
          top: cy(activeIndex) - NODE / 2 - 14,
        }}
      >
        <Zappy size={58} pose={activeDone ? 'celebrating' : 'waving'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
  },
  nodeWrap: { position: 'absolute', width: 110, alignItems: 'center' },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: radius.full,
    backgroundColor: colors.surface1,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActive: {
    backgroundColor: colors.gold,
    borderColor: colors.goldLight,
    shadowColor: colors.gold,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  nodeLocked: { backgroundColor: colors.surface1, opacity: 0.6 },
  nodeText: { fontFamily: font.bold, fontSize: 20, color: colors.textSecondary },
  nodeTextActive: { color: colors.onGold },
  nodeName: {
    fontFamily: font.semibold,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 7,
  },
  nodeNameActive: { color: colors.goldLight },
  progressChip: {
    backgroundColor: colors.goldTint,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 4,
  },
  progressText: { fontFamily: font.bold, fontSize: 11, color: colors.goldLight },
});
