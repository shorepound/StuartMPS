#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Stopping frontend process (if running)..."
if [ -f "$ROOT/client/vite.pid" ]; then
  PID=$(cat "$ROOT/client/vite.pid" 2>/dev/null || true)
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null || true
  fi
  rm -f "$ROOT/client/vite.pid"
fi

echo "Stopping backend process (if running)..."
if [ -f "$ROOT/src/MovingApi/movingapi.pid" ]; then
  PID=$(cat "$ROOT/src/MovingApi/movingapi.pid" 2>/dev/null || true)
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null || true
  fi
  rm -f "$ROOT/src/MovingApi/movingapi.pid"
fi

echo "Stopping docker-compose services..."
docker compose down

echo "All services stopped."
