#!/usr/bin/env bash
set -euo pipefail

# Start all dev services: docker, run migrations, backend and frontend (dev)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Starting docker-compose..."
docker compose up -d

# Note: healthcheck-based waiting removed; migrations will retry until DB is ready.

echo "Applying EF Core migrations (will retry until DB is ready)..."
cd "$ROOT/src/MovingApi"
RETRIES=12
SLEEP=5
for i in $(seq 1 $RETRIES); do
  if dotnet ef database update; then
    echo "Migrations applied."
    break
  else
    echo "Migration attempt $i/$RETRIES failed — retrying in $SLEEP seconds..."
    sleep $SLEEP
  fi
  if [ "$i" -eq "$RETRIES" ]; then
    echo "Migrations failed after $RETRIES attempts." >&2
    exit 1
  fi
done

echo "Starting backend (dotnet run)..."
dotnet run --urls "http://localhost:5000" &> "$ROOT/src/MovingApi/movingapi.log" &
echo $! > "$ROOT/src/MovingApi/movingapi.pid"

echo "Starting frontend (vite)..."
cd "$ROOT/client"
npm run dev &> "$ROOT/client/vite.log" &
echo $! > "$ROOT/client/vite.pid"

echo "All services started."
echo "Backend log: $ROOT/src/MovingApi/movingapi.log"
echo "Frontend log: $ROOT/client/vite.log"
