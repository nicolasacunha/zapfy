import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  /** Botão (ou conteúdo) fixo na base da tela */
  footer?: ReactNode;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
};

export default function ScreenShell({ children, footer, scroll = false, keyboardAvoiding = false }: Props) {
  const insets = useSafeAreaInsets();

  const content = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content]}>{children}</View>
  );

  const body = (
    <View style={styles.flex}>
      {content}
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>{footer}</View>
      ) : null}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {body}
      </KeyboardAvoidingView>
    );
  }
  return body;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 24 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 16 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
});
