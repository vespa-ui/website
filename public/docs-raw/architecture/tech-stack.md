# Tech Stack

Backend, frontend, and tooling choices.

## Backend

- **NestJS** — application framework
- **TypeORM** — SQLite (default) or PostgreSQL (production)
- **Passport / JWT** — authentication
- **Express** — HTTP server

## Frontend

- **React 18**
- **Vite** — dev server and build
- **Elastic UI (EUI)** — component library and design system
- **Apache ECharts** — metrics and evaluation charts
- **TanStack Query** — server-state data fetching and caching
- **Zustand** — local UI state

## Tooling

- **pnpm workspaces** + **Turborepo** for the monorepo
- **ESLint** + **Prettier**
- **Docker** for packaging — a single image serves both the API and the built frontend
