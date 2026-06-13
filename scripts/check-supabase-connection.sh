#!/usr/bin/env bash
# Verifica conectividad con Supabase desde WSL/Linux.
# Uso: bash scripts/check-supabase-connection.sh

set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-nekjvszntyaswghwtrig}"
HOST="${PROJECT_REF}.supabase.co"
URL="https://${HOST}/rest/v1/"

echo "== Neon Shop — diagnóstico Supabase =="
echo "Host: ${HOST}"
echo

echo "1) DNS (resolv.conf actual):"
if [ -f /etc/resolv.conf ]; then
  grep -E '^nameserver' /etc/resolv.conf || true
else
  echo "  /etc/resolv.conf no encontrado"
fi
echo

echo "2) Resolución DNS:"
if command -v nslookup >/dev/null 2>&1; then
  if nslookup "${HOST}" 2>&1 | head -8; then
    :
  else
    echo "  FALLO: no se pudo resolver ${HOST}"
    echo "  → En WSL suele arreglarse cambiando DNS a 8.8.8.8 / 1.1.1.1"
  fi
else
  echo "  nslookup no instalado"
fi
echo

echo "3) HTTP a Supabase REST:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 15 -m 20 "${URL}" -H "apikey: test" || echo "000")
echo "  HTTP ${HTTP_CODE} (401/400 es normal sin API key válida; 000 = sin conexión)"
echo

if [ "${HTTP_CODE}" = "000" ]; then
  echo "RESULTADO: NO HAY CONECTIVIDAD con Supabase desde esta máquina."
  echo
  echo "Fix recomendado en WSL (PowerShell como admin, luego reinicia WSL):"
  echo "  wsl --shutdown"
  echo
  echo "Dentro de WSL (sudo):"
  echo "  sudo tee /etc/wsl.conf >/dev/null <<'EOF'"
  echo "  [network]"
  echo "  generateResolvConf = false"
  echo "  EOF"
  echo "  sudo tee /etc/resolv.conf >/dev/null <<'EOF'"
  echo "  nameserver 8.8.8.8"
  echo "  nameserver 1.1.1.1"
  echo "  EOF"
  exit 1
fi

echo "RESULTADO: conectividad OK (la app debería poder hablar con Supabase)."
exit 0
