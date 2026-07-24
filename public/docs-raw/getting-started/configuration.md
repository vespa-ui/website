# Configuration

Environment variables used by the backend.

Copy the example env file and adjust as needed:

```bash
cp .env.example .env
```

## Key variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server port | `3000` |
| `DATABASE_TYPE` | `sqlite` or `postgres` | `sqlite` |
| `VESPA_ENDPOINT` | Vespa query endpoint | `http://localhost:8080` |
| `VESPA_CONFIG_ENDPOINT` | Vespa config server endpoint | `http://localhost:19071` |
| `JWT_SECRET` / `SESSION_SECRET` | Auth secrets — **must** change in production | — |
| `ENABLE_REGISTRATION` | Allow the first-run setup wizard | `true` |

See `.env.example` in the repository root for the full list.

## Useful scripts

```bash
pnpm build           # Build backend + frontend
pnpm test            # Run all tests
pnpm test:watch      # Run tests in watch mode
pnpm lint            # Lint with ESLint
pnpm format          # Format with Prettier
pnpm db:reset        # Reset the local SQLite database
```
