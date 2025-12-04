#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Docker services (filter moving_mssql):"
docker ps --filter name=moving_mssql --format 'table {{.Names}}	{{.Status}}	{{.Ports}}' || true

echo
echo "Backend status"
if [ -f "$ROOT/src/MovingApi/movingapi.pid" ]; then
  PID=$(cat "$ROOT/src/MovingApi/movingapi.pid" 2>/dev/null || true)
  echo "PID: $PID"
  ps -p "$PID" -o pid,comm,etime || true
  echo "Last backend log lines:"
  tail -n 30 "$ROOT/src/MovingApi/movingapi.log" 2>/dev/null || true
else
  echo "No backend pid file found."
fi

echo
echo "Frontend status"
if [ -f "$ROOT/client/vite.pid" ]; then
  PID=$(cat "$ROOT/client/vite.pid" 2>/dev/null || true)
  echo "PID: $PID"
  ps -p "$PID" -o pid,comm,etime || true
  echo "Last frontend log lines:"
  tail -n 30 "$ROOT/client/vite.log" 2>/dev/null || true
else
  echo "No frontend pid file found."
fi
