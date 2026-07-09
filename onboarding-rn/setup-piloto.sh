#!/bin/bash
# Zapfy — monta e roda o app do piloto a partir desta pasta.
# Uso: bash onboarding-rn/setup-piloto.sh  (na raiz da pasta zapfy)
# Requisitos: Node 18+, app Expo Go no celular (App Store / Play Store).
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="$DIR/../zapfy-app"

if [ ! -d "$TARGET" ]; then
  echo "→ Criando projeto Expo em $TARGET..."
  npx create-expo-app@latest "$TARGET" --template blank-typescript --no-install
fi

echo "→ Copiando código e assets..."
cp "$DIR/App.tsx" "$TARGET/"
rm -rf "$TARGET/src" && cp -r "$DIR/src" "$TARGET/"
mkdir -p "$TARGET/assets" && cp -r "$DIR/assets/." "$TARGET/assets/"

cd "$TARGET"
echo "→ Instalando dependências (primeira vez demora alguns minutos)..."
npm install --no-audit --no-fund
npx expo install expo-font @expo-google-fonts/inter react-native-safe-area-context expo-video expo-image-picker @react-native-async-storage/async-storage

echo ""
echo "✓ Pronto. Abrindo o Expo — escaneie o QR code com o app Expo Go no celular."
npx expo start
