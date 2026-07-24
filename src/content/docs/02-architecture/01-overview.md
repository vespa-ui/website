---
title: Overview
description: How the monorepo and the security model fit together.
order: 1
---

Vespa UI is a pnpm + Turborepo monorepo, 100% TypeScript:

```text
vespa_client/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Vite + React app
├── packages/
│   ├── shared/            # Shared types & DTOs
│   ├── vespa-client/      # Vespa HTTP client
│   └── components/        # Reusable UI components
├── docker/                 # Docker entrypoint & config
└── docs/                   # Additional documentation
```

## Security model

Vespa credentials are never sent to the browser. The frontend talks only to the Vespa UI backend; the backend proxies every request to the configured Vespa cluster(s) and stores connection secrets encrypted at rest.

- Auth is JWT-based, with admin-created users — there is no open self-registration.
- IP allowlisting, backups, and retention policies are configurable per organization.
- All operations are audit-logged.
