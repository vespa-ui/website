# Installation

Run Vespa UI locally with pnpm, or in production with Docker.

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose (for containerized runs)

## Development

```bash
pnpm install
pnpm dev
```

This starts both apps concurrently:

- Backend API: `http://localhost:3000/api`
- Frontend: `http://localhost:5173`

On first run, open the frontend and complete the `/setup` wizard to create the first admin user and organization.

## Docker Compose (app + Vespa)

The fastest way to try Vespa UI end to end — this builds the image, starts a local Vespa instance, and serves the UI:

```bash
docker-compose up -d
```

Access it at `http://localhost:3000`.

## Docker (manual)

```bash
docker build -t vespa-ui:latest .

docker run -d \
  -p 3000:3000 \
  -e DATABASE_TYPE=sqlite \
  -e VESPA_ENDPOINT=http://vespa:8080 \
  -e VESPA_CONFIG_ENDPOINT=http://vespa:19071 \
  -e JWT_SECRET=change-me \
  -e SESSION_SECRET=change-me \
  -v vespa-data:/app/data \
  vespa-ui:latest
```

Complete the setup wizard on first login.

## Using PostgreSQL instead of SQLite

```bash
docker run -d \
  --name vespa-ui-db \
  -e POSTGRES_DB=vespa_ui \
  -e POSTGRES_USER=vespa_ui \
  -e POSTGRES_PASSWORD=secure_password \
  postgres:15
```

Then set `DATABASE_TYPE=postgres` and `DATABASE_URL=postgresql://vespa_ui:secure_password@localhost:5432/vespa_ui`.

> **Security note:** always change `JWT_SECRET` and `SESSION_SECRET` before deploying to production, and serve behind HTTPS.
