#!/bin/bash
# Doble clic para verificar el proyecto ANTES de subir a GitHub.
cd "$(dirname "$0")"
echo "════════════════════════════════════════"
echo "  VERIFICANDO REPUESTOHOY — espera..."
echo "════════════════════════════════════════"
echo ""
echo "1/2 Instalando dependencias..."
npm install --silent || { echo ""; echo "❌ ERROR instalando. Toma foto de esta pantalla y envíala a Claude."; read -p "Presiona Enter para cerrar..."; exit 1; }
echo "2/2 Compilando (npm run build)..."
if npm run build; then
  echo ""
  echo "════════════════════════════════════════"
  echo "  ✅ TODO BIEN — seguro para subir a GitHub"
  echo "════════════════════════════════════════"
else
  echo ""
  echo "════════════════════════════════════════"
  echo "  ❌ HAY UN ERROR — NO subas todavía."
  echo "  Toma foto de las líneas rojas de arriba"
  echo "  y envíasela a Claude para arreglarlo."
  echo "════════════════════════════════════════"
fi
read -p "Presiona Enter para cerrar..."
