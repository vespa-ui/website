# Vespa UI — Website

Landing page and documentation site for [Vespa UI](../README.md), built with React, Vite, and [Elastic UI](https://eui.elastic.co/) (EUI). Deploys as a static site to GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc --noEmit only
```

## Structure

```
website/
├── src/
│   ├── content/docs/   # Markdown docs content — see "Writing docs" below
│   ├── components/Seo.tsx  # Per-route <head> tags (title, description, canonical, OG, JSON-LD)
│   ├── layout/         # Header/nav shell, page container
│   ├── lib/             # Markdown/frontmatter parsing, docs tree builder
│   ├── pages/           # Home, About, Credits, Docs
│   ├── theme.ts         # EUI theme overrides for the brand palette
│   └── colorMode.tsx    # Light/dark toggle (persisted to localStorage)
├── scripts/generate-seo.mjs  # Builds sitemap.xml, llms.txt, llms-full.txt, docs-raw/ — see below
├── public/
│   ├── robots.txt      # Allows standard + AI/LLM crawlers, points to sitemap.xml
│   └── 404.html        # GitHub Pages SPA redirect trick (see "Structure" above)
└── .github isn't here — workflows live at ../.github/workflows/:
    - deploy-website.yml         # builds and deploys to GitHub Pages
    - generate-seo-files.yml     # regenerates sitemap.xml/llms.txt on doc changes
```

Routing uses `BrowserRouter` with real paths (`/docs/getting-started/installation`, not
`#/docs/...`) so each page has its own crawlable, indexable URL — important for SEO, since search
engines treat different hash fragments of the same URL as one page. GitHub Pages has no
server-side rewrite rules, so `public/404.html` + the inline script in `index.html` implement the
standard [SPA-for-GitHub-Pages redirect trick](https://github.com/rafgraph/spa-github-pages) to
make deep links work anyway.

## Writing docs

Docs are plain Markdown files under `src/content/docs/`. Commit a `.md` file and it appears on the
site and in the sidebar automatically — no route or nav entry to wire up by hand.

```
content/docs/
├── 01-getting-started/
│   ├── 01-introduction.md
│   └── 02-installation.md
└── 02-architecture/
    └── 01-overview.md
```

- A leading `NN-` on a file or folder name controls sort order and is stripped from the slug/title.
- Each folder becomes a collapsible group in the sidebar; folders can be nested arbitrarily deep.
- Files placed directly in `content/docs/` (no folder) appear ungrouped at the top of the sidebar.
- Optional frontmatter per file:

  ```markdown
  ---
  title: Custom Title
  description: One sentence shown under the page title.
  order: 10
  ---
  ```

- Link to another doc page with a site-relative path: `[Installation](/docs/getting-started/installation)`.

See [`src/content/docs/99-writing-docs.md`](src/content/docs/99-writing-docs.md) for the same guide rendered on the live site.

## Brand theme

Brand colors (`#61D790` green / `#020202` ink) are applied by overriding EUI's Borealis theme
tokens in [`src/theme.ts`](src/theme.ts) — see the comments there for why specific derived shades
are used for text/links/buttons instead of the raw brand green (WCAG contrast).

## SEO & GEO

Because this is a client-rendered SPA, there's no per-route server response to attach different
`<head>` content to — [`src/components/Seo.tsx`](src/components/Seo.tsx) does it at runtime
instead, setting `document.title`, the meta description, the `robots` tag, a canonical link,
Open Graph / Twitter tags, and (on docs pages) a `BreadcrumbList` JSON-LD block. Every page
(`Home`, `About`, `Credits`, `DocsPage`, `NotFound`) renders a `<Seo>` with its own title and
description; `index.html` carries sitewide defaults (`Organization` / `WebSite` /
`SoftwareApplication` JSON-LD) for crawlers that only fetch the initial HTML.

`npm run generate:seo` (also run automatically by `npm run build`, and by
`../.github/workflows/generate-seo-files.yml` whenever docs content changes) reads
`src/content/docs/**/*.md` and writes into `public/`:

- **`sitemap.xml`** — every static page plus every doc page, with `<lastmod>` from the file's
  mtime.
- **`llms.txt`** / **`llms-full.txt`** — an [llms.txt](https://llmstxt.org/)-format index and full
  content dump for LLMs/agents.
- **`docs-raw/<slug>.md`** — a plain-Markdown mirror of every doc page. AI/LLM crawlers (GPTBot,
  ClaudeBot, PerplexityBot, etc.) generally fetch over plain HTTP without executing JavaScript, so
  without this they'd see only the near-empty SPA shell; `llms.txt` and the sitemap link to these
  raw files instead of the HTML routes for that reason.

`public/robots.txt` allows those crawlers explicitly (GEO — being retrievable and citable by AI
answer engines) alongside standard search bots, and points to `sitemap.xml`.

If you move off the default GitHub Pages project-site URL (`https://vespa-ui.github.io/vespa-ui/`),
update all of:

- `SITE_ORIGIN` in [`src/components/Seo.tsx`](src/components/Seo.tsx)
- `SITE_ORIGIN` / `SITE_BASE` in `../.github/workflows/generate-seo-files.yml`'s `env:` block
  (or pass them when running `npm run generate:seo` locally)
- the `Sitemap:` line and canonical URLs baked into `index.html`
- `pathSegmentsToKeep` in `public/404.html` (`1` for a GitHub Pages project site, `0` for a custom
  domain or user/org page — same condition as the `VITE_BASE` override above)

## Deployment

`.github/workflows/deploy-website.yml` (repo root) builds this folder and publishes it to GitHub
Pages on every push to `main` that touches `website/**`. It computes the Vite `base` path from the
repository name automatically, which is correct for a project page
(`https://<user>.github.io/<repo>/`).

If you're serving from a custom domain or a user/org page (`<user>.github.io`) instead:

- Set `VITE_BASE=/` (edit the workflow's `env:` block), and
- Add a `CNAME` file with your domain under `website/public/` for a custom domain.

In the repository settings, set **Settings → Pages → Source** to **GitHub Actions**.
