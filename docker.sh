#!/usr/bin/env bash
# ============================================================
#  Bautista Web — Docker Manager
#  Gestión completa del entorno para el Portfolio
#  Uso: ./docker.sh [comando]
# ============================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
PROJECT_NAME="bautista-web"

# ─── Colores ─────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

# ─── Helpers ─────────────────────────────────────────────────
ok()   { echo -e "${GREEN}✔  $*${NC}"; }
info() { echo -e "${CYAN}▶  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }
err()  { echo -e "${RED}✘  $*${NC}"; }
sep()  { echo -e "${GREEN}────────────────────────────────────────────────${NC}"; }

check_docker() {
  if ! command -v docker &>/dev/null; then
    err "Docker no está instalado o no está en el PATH."
    exit 1
  fi
  if ! docker info &>/dev/null; then
    err "El daemon de Docker no está corriendo. Inicialo con: sudo systemctl start docker"
    exit 1
  fi
}

print_header() {
  echo ""
  echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}${BOLD}║   🚀  Bautista Web — Docker Manager         ║${NC}"
  echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════╝${NC}"
  echo ""
}

print_menu() {
  echo -e "${BOLD}${CYAN}  BUILD & ARRANQUE${NC}"
  echo -e "  ${YELLOW}up${NC}          Levantar el entorno Dev (Vite/Node)"
  echo -e "  ${YELLOW}build${NC}       Buildear imagen del entorno dev"
  echo -e "  ${YELLOW}rebuild${NC}     Rebuildear imagen (con caché)"
  echo -e "  ${YELLOW}rebuild-nc${NC}  Rebuildear sin caché (from scratch)"
  echo -e "  ${YELLOW}start${NC}       Iniciar servicios ya creados (sin rebuild)"
  echo ""
  echo -e "${BOLD}${CYAN}  DETENCIÓN${NC}"
  echo -e "  ${YELLOW}stop${NC}        Detener servicios (mantiene containers)"
  echo -e "  ${YELLOW}down${NC}        Detener y eliminar containers"
  echo ""
  echo -e "${BOLD}${CYAN}  LIMPIEZA${NC}"
  echo -e "  ${YELLOW}clean${NC}       Eliminar containers y volúmenes de datos"
  echo -e "  ${YELLOW}clean-images${NC} Eliminar containers, volúmenes e imágenes del proyecto"
  echo -e "  ${YELLOW}purge${NC}       Limpieza total: todo lo anterior + prune del sistema"
  echo ""
  echo -e "${BOLD}${CYAN}  LOGS${NC}"
  echo -e "  ${YELLOW}logs${NC}        Ver logs del entorno dev"
  echo ""
  echo -e "${BOLD}${CYAN}  ESTADO & DIAGNÓSTICO${NC}"
  echo -e "  ${YELLOW}status${NC}      Ver estado de containers y puertos"
  echo -e "  ${YELLOW}ps${NC}          Listar containers del proyecto"
  echo ""
  echo -e "${BOLD}${CYAN}  UTILIDADES${NC}"
  echo -e "  ${YELLOW}shell${NC}       Entrar al entorno Dev para correr comandos (npm run dev, etc)"
  echo -e "  ${YELLOW}restart${NC}     Reiniciar servicios"
  echo -e "  ${YELLOW}urls${NC}        Mostrar URLs de acceso"
  echo ""
  echo -e "  ${YELLOW}help${NC}        Mostrar esta ayuda"
  echo ""
}

# ─── Comandos ────────────────────────────────────────────────

cmd_up() {
  info "Levantando el entorno (build automático si es necesario)..."

  # Limpiar containers conflictivos si los hubiere
  local -a conflicting=("bautista-web-dev-1")
  for container in "${conflicting[@]}"; do
    if docker inspect "$container" &>/dev/null; then
      local proj_label
      proj_label=$(docker inspect --format='{{index .Config.Labels "com.docker.compose.project"}}' "$container" 2>/dev/null || echo "")
      if [[ "$proj_label" != "$PROJECT_NAME" ]]; then
        warn "Container huérfano detectado: $container (proyecto: ${proj_label:-desconocido}) → eliminando..."
        docker rm -f "$container" &>/dev/null
      fi
    fi
  done

  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d --build --remove-orphans
  sep
  ok "Entorno Dev levantado."
  cmd_urls
}

cmd_build() {
  info "Buildeando imagen de desarrollo..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build dev
  ok "Build completado."
}

cmd_rebuild() {
  info "Rebuildeando imagen de desarrollo (con caché)..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build --pull dev
  ok "Rebuild completado."
}

cmd_rebuild_nc() {
  info "Rebuildeando imagen de desarrollo SIN CACHÉ..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build --no-cache dev
  ok "Rebuild sin caché completado."
}

cmd_start() {
  info "Iniciando servicios existentes..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d
  ok "Servicios iniciados."
  cmd_urls
}

cmd_stop() {
  info "Deteniendo servicios..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" stop
  ok "Servicios detenidos."
}

cmd_down() {
  info "Deteniendo y eliminando containers..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
  ok "Containers eliminados."
}

cmd_clean() {
  warn "Esto eliminará containers y volúmenes."
  read -rp "  ¿Continuás? [s/N]: " confirm
  [[ "${confirm,,}" == "s" ]] || { echo "Cancelado."; exit 0; }
  info "Eliminando containers y volúmenes..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v
  ok "Containers y volúmenes eliminados."
}

cmd_clean_images() {
  warn "Esto eliminará containers, volúmenes E IMÁGENES del proyecto."
  read -rp "  ¿Continuás? [s/N]: " confirm
  [[ "${confirm,,}" == "s" ]] || { echo "Cancelado."; exit 0; }
  info "Eliminando containers, volúmenes e imágenes..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v --rmi local
  ok "Limpieza de imágenes completada."
}

cmd_purge() {
  warn "PURGE TOTAL: eliminará containers, volúmenes, imágenes Y hará docker system prune."
  read -rp "  ¿Estás seguro? [s/N]: " confirm
  [[ "${confirm,,}" == "s" ]] || { echo "Cancelado."; exit 0; }
  info "Ejecutando purge total..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v --rmi all 2>/dev/null || true
  docker system prune -f
  ok "Purge total completado. Sistema Docker limpio."
}

cmd_logs() {
  info "Logs (Ctrl+C para salir)..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f
}

cmd_status() {
  sep
  echo -e "${BOLD}${CYAN}  Estado de containers:${NC}"
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps 2>/dev/null || echo "  (ningún container activo)"
  sep
  echo -e "${BOLD}${CYAN}  Puertos del proyecto en uso:${NC}"
  local fp
  fp=$(docker inspect --format='{{range $p,$b := .NetworkSettings.Ports}}{{if eq $p "5173/tcp"}}{{(index $b 0).HostPort}}{{end}}{{end}}' bautista-web-dev-1 2>/dev/null || echo "?")
  
  echo -e "  Frontend UI: localhost:${fp:-desconocido}"
  sep
}

cmd_ps() {
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
}

cmd_shell() {
  info "Abriendo shell en el entorno de desarrollo..."
  docker exec -it bautista-web-dev-1 bash || docker exec -it bautista-web-dev-1 sh
}

cmd_restart() {
  info "Reiniciando servicios..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" restart
  ok "Servicios reiniciados."
}

# Obtiene el puerto del host asignado a un container dado un puerto interno
get_host_port() {
  local container=$1 internal=$2
  docker inspect --format="{{(index (index .NetworkSettings.Ports \"${internal}/tcp\") 0).HostPort}}" \
    "$container" 2>/dev/null || echo "?"
}

cmd_urls() {
  local fp
  fp=$(get_host_port bautista-web-dev-1 5173)
  echo ""
  sep
  echo -e "  ${BOLD}URLs de acceso:${NC}"
  echo -e "  ${CYAN}Portfolio Vite UI:${NC}   http://localhost:${fp}"
  sep
  echo ""
  echo -e "  ${YELLOW}▶ Para correr la app, abrí la terminal y ejecutá:${NC}"
  echo -e "    ${BOLD}Terminal:${NC} ./docker.sh shell  ->  npm run dev"
  echo ""
}

# ─── Main ────────────────────────────────────────────────────
check_docker

COMMAND="${1:-help}"

case "$COMMAND" in
  up)           cmd_up ;;
  build)        cmd_build ;;
  rebuild)      cmd_rebuild ;;
  rebuild-nc)   cmd_rebuild_nc ;;
  start)        cmd_start ;;
  stop)         cmd_stop ;;
  down)         cmd_down ;;
  clean)        cmd_clean ;;
  clean-images) cmd_clean_images ;;
  purge)        cmd_purge ;;
  logs)         cmd_logs ;;
  status)       cmd_status ;;
  ps)           cmd_ps ;;
  shell)        cmd_shell ;;
  restart)      cmd_restart ;;
  urls)         cmd_urls ;;
  help|--help|-h)
    print_header
    print_menu
    ;;
  *)
    err "Comando desconocido: '$COMMAND'"
    echo -e "  Usá ${YELLOW}./docker.sh help${NC} para ver los comandos disponibles."
    exit 1
    ;;
esac
