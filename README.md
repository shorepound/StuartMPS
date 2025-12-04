# Moving App

This workspace contains a sample schema and skeleton apps for a Moving, Packing, and Storage application.

Quick start (macOS):

1. Start SQL Server in Docker:


This repository contains:
- An ASP.NET Core Web API backend with Entity Framework Core and Identity (`src/MovingApi`).
- A Vite + React + TypeScript frontend (`client`) with Tailwind CSS.
- A Docker Compose setup that runs SQL Server for local development.

**Requirements**
- Docker Desktop (for the SQL Server container)
- .NET 8 SDK (for the backend)
- Node.js 18+ and npm (for the frontend)

**Quick Start (macOS)**

1. Start the database container:

```bash
docker compose up -d
```

2. Run the project bootstrap and start services (project root):

# Moving App

A small sample project demonstrating a Moving, Packing, and Storage application.

This repository contains:
- An ASP.NET Core Web API backend with Entity Framework Core and Identity (`src/MovingApi`).
- A Vite + React + TypeScript frontend (`client`) with Tailwind CSS.
- A Docker Compose setup that runs SQL Server for local development.

**Requirements**
- Docker Desktop (for the SQL Server container)
- .NET 8 SDK (for the backend)
- Node.js 18+ and npm (for the frontend)

## Quick Start (macOS)

1. Start the database container:

```bash
docker compose up -d
```

2. Run the project bootstrap and start services (project root):

```bash
./scripts/start-all.sh
```

The `start-all.sh` script will:
- Start docker-compose services.
- Apply EF Core migrations (it will retry until the database accepts connections).
- Start the backend and the frontend dev server.

### Manual starts

- Run backend:

```bash
cd src/MovingApi
dotnet restore
dotnet run
```

- Run frontend:

```bash
cd client
npm install
npm run dev
```

- Apply EF Core migrations locally:

```bash
cd src/MovingApi
dotnet ef database update
```

## Configuration

- The default DB connection is configured for local dev in `src/MovingApi/appsettings.Development.json` (Server=localhost,1433; SA credentials). Update credentials if you change Docker or host settings.

## Development notes

- The backend seeds an admin role/user during startup when running in Development.
- EF Core retry-on-failure is enabled to improve resilience during DB startup.
- The frontend uses JWT for authentication; token parsing and role checks are implemented client-side for UI visibility. Protected endpoints are enforced server-side with `[Authorize(Roles = "Admin")]`.

**Default seeded admin credentials (development)**

```
email: admin@example.com
password: Admin123!
```

You can change these values in `src/MovingApi/appsettings.Development.json`.

## Frontend (Tailwind + Vite)

- Tailwind is configured in `client/tailwind.config.cjs` and PostCSS is in `client/postcss.config.cjs`.
- Global styles are imported from `client/src/styles.css`.

## Operational recommendations

- Increase Docker Desktop memory to at least 4GB when running SQL Server locally. SQL Server images can be memory intensive and may be terminated by the host if memory is constrained.
- Keep the `scripts/start-all.sh` migration retry logic — it helps when the database takes time to recover.
- Consider using `restart: unless-stopped` in `docker-compose.yml` for local resilience against transient container crashes.
- For live DB startup logs while SQL Server recovers, follow the container logs:

```bash
docker compose logs -f moving_mssql
```

## Troubleshooting

- If the frontend or backend reports `Unable to connect to SQL Server` during startup, wait a minute and re-run migrations; the DB may still be recovering.
- If you see OOM or process-killed errors for the SQL container, increase Docker memory and restart the container.

Example health checks (useful when verifying services):

```bash
# health endpoint
curl http://localhost:5000/health

# customers endpoint
curl http://localhost:5000/api/customers
```

## Contributing / Workflow

- Use feature branches and open a PR for changes.
- Keep migrations in sync: create EF migrations locally and include them in commits when modifying the data model.

## Developer quick checklist
1. Create a feature branch: `git checkout -b feat/your-feature`
2. Start services: `./scripts/start-all.sh`
3. Register a user via the frontend or API
4. Login as the seeded admin (see credentials above) and verify the Admin UI
5. Create EF migrations locally when changing models: `dotnet ef migrations add YourChange` and include them in commits
6. Open a PR, request review, merge when green

## Files to know
- `src/MovingApi` — backend project (controllers, data, migrations)
- `client` — frontend project (React + Vite + Tailwind)
- `docker-compose.yml` — development services (SQL Server)
- `scripts/start-all.sh` and `scripts/restart-all.sh` — convenience scripts to run/dev services

---

If you'd like, I can also create a `CONTRIBUTING.md` with more detailed guidelines.

