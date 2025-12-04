# Moving App (sample)

This workspace contains a sample schema and skeleton apps for a Moving, Packing, and Storage application.

Quick start (macOS):

1. Start SQL Server in Docker:

```bash
docker compose up -d
```

2. Create the database and run schema (example using `sqlcmd`):

```bash
docker exec -it moving_mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Your_password123 -Q "CREATE DATABASE MovingDb"
docker exec -i moving_mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Your_password123 -d MovingDb -i /var/opt/mssql/schema.sql
```

Alternatively run the SQL in `db/schema.sql` using your DB tool.

3. Run the backend (requires .NET 8 SDK):

```bash
cd src/MovingApi
dotnet restore
dotnet run
```

4. Run the frontend (requires Node 18+):

```bash
cd client
npm install
npm run dev
```

Notes
- The backend `appsettings.Development.json` points to `localhost:1433` with default SA password `Your_password123`. Update as needed.
- I included EF Core models and `AppDbContext` but not migrations — you can create migrations with `dotnet ef migrations add Initial` and apply them.

Tailwind (frontend)
- Tailwind has been added to the `client` project. The project uses Vite + React; Tailwind configuration is in `client/tailwind.config.cjs` and PostCSS config is in `client/postcss.config.cjs`.
- To install and run the frontend with Tailwind:

```bash
cd client
npm install
npm run dev
```

- Styles are imported from `client/src/styles.css`, which includes `@tailwind` directives. Use Tailwind utility classes in components (example pages `Login.tsx`, `Register.tsx`, `Admin.tsx`, `Customers.tsx` have been updated).
- Security note: `vite` was upgraded to a patched version to address an `esbuild` advisory. If you later upgrade or change Vite, re-check `npm audit` and verify the dev server.
