# Introduction

What Vespa UI is, and who it's for.

Vespa UI is a modern, self-hosted administration platform for [Vespa](https://vespa.ai/). It gives operators a single web interface to search, inspect, debug, and monitor Vespa clusters — without ever exposing cluster credentials to the browser.

## Why Vespa UI

Vespa is operated almost entirely through configuration files, `curl`, and the Vespa CLI. That works, but it puts a high floor on who can safely operate a cluster day to day. Vespa UI wraps the most common operational tasks — running and debugging queries, inspecting schemas, evaluating ranking quality, watching metrics — in a UI that a wider team can use.

## Key features

- **Multi-cluster management** — connect to and switch between multiple Vespa clusters
- **Search playground** — a visual query builder with a ranking debugger
- **Document & schema tools** — full document CRUD, a schema explorer, and a visual schema editor
- **Embeddings inspector** — tensor stats, similarity metrics, and 2D projections
- **Evaluation runs** — NDCG, MAP, MRR, and F1 scoring with run comparison
- **Monitoring** — historical metrics, alerts, background jobs, and audit logging

## Architecture at a glance

Vespa UI ships as a single Docker container:

- **Backend** — NestJS · TypeORM (SQLite or PostgreSQL) · Passport/JWT
- **Frontend** — React 18 · Vite · Elastic UI · Apache ECharts

Credentials for the underlying Vespa cluster(s) are stored and used **server-side only** — the browser talks to the Vespa UI backend, never directly to Vespa.

Continue to [Installation](/docs/getting-started/installation) to get a local instance running.
