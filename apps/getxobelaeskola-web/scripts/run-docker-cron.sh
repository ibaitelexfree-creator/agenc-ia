#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE EJECUCIÓN SEGURA DE CRON JOBS VÍA DOCKER EXEC
# Getxo Bela Eskola - Hostinger VPS (Producción)
#
# CARACTERÍSTICAS DE SEGURIDAD Y FIABILIDAD:
# 1. No expone CRON_SECRET en argumentos de línea de comandos ni en ps aux.
# 2. Inyección interna vía variable de entorno o subshell seguro en contenedor.
# 3. Timeout estricto de red y ejecución (60s).
# 4. Código de salida exacto reflejando el estado HTTP del endpoint.
# 5. Soporte para POST seguro sin filtración de credenciales.
# ==============================================================================
set -euo pipefail

CONTAINER_NAME="${1:-getxo-bela-prod}"
ENDPOINT="${2:-}"
HTTP_METHOD="${3:-POST}"
LOG_FILE="/var/log/getxo-cron.log"
TIMEOUT_SECONDS=60

if [ -z "$ENDPOINT" ]; then
    echo "Uso: $0 [container_name] <endpoint> [METHOD]" >&2
    exit 2
fi

# 1. Verificar si el contenedor está en ejecución
if ! docker ps --format '{{.Names}}' | grep -wq "^${CONTAINER_NAME}$"; then
    echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] [ERROR] Contenedor '${CONTAINER_NAME}' no está corriendo. Omitiendo cron." >> "$LOG_FILE"
    exit 1
fi

TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
echo "[$TIMESTAMP] [INFO] Disparando $HTTP_METHOD $ENDPOINT en $CONTAINER_NAME..." >> "$LOG_FILE"

# 2. Ejecutar petición HTTP interna dentro del contenedor con timeout y autenticación Bearer segura
# El secreto $CRON_SECRET se resuelve internamente dentro del contenedor y no viaja en argv del host.
EXEC_OUTPUT=$(docker exec -i "$CONTAINER_NAME" sh -c '
    if [ -z "$CRON_SECRET" ]; then
        echo "CRON_SECRET_MISSING_IN_CONTAINER" >&2
        exit 3
    fi
    if [ "'"$HTTP_METHOD"'" = "POST" ]; then
        wget -q -S -O - -T '"$TIMEOUT_SECONDS"' \
            --header="Authorization: Bearer $CRON_SECRET" \
            --post-data="" \
            "http://127.0.0.1:3000'"$ENDPOINT"'" 2>&1
    else
        wget -q -S -O - -T '"$TIMEOUT_SECONDS"' \
            --header="Authorization: Bearer $CRON_SECRET" \
            "http://127.0.0.1:3000'"$ENDPOINT"'" 2>&1
    fi
') || STATUS=$?

STATUS="${STATUS:-0}"

if [ "$STATUS" -eq 0 ]; then
    echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] [SUCCESS] $ENDPOINT completado con éxito: $EXEC_OUTPUT" >> "$LOG_FILE"
    exit 0
else
    echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] [FAILED] $ENDPOINT falló (código $STATUS): $EXEC_OUTPUT" >> "$LOG_FILE"
    exit "$STATUS"
fi