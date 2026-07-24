#!/usr/bin/env node
// Generates public/sitemap.xml, public/llms.txt, public/llms-full.txt, and a
// raw Markdown mirror of every doc under public/docs-raw/ from the content
// in src/content/docs/**/*.md.
//
// Runs on every `npm run build` (see package.json) and is also re-run by
// .github/workflows/generate-seo-files.yml whenever docs content changes, so
// the committed copies in public/ stay in sync between deploys.
//
// llms.txt / llms-full.txt follow the https://llmstxt.org convention. The
// docs-raw/*.md mirror exists because LLM/AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, ...) generally fetch plain HTTP without executing JS — this
// is a client-rendered SPA, so the HTML pages themselves are near-empty to
// those crawlers. Plain-text Markdown at a stable URL is what they can
// actually read.
//
// Config via env vars (defaults match the GitHub Pages project-site deploy
// described in vite.config.ts / README.md):
//   SITE_ORIGIN  default "https://vespa-ui.github.io"
//   SITE_BASE    default "/vespa-ui/" (must match vite.config.ts's VITE_BASE)

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'src/content/docs');
const PUBLIC_DIR = join(ROOT, 'public');
const DOCS_OUT_DIR = join(PUBLIC_DIR, 'docs-raw');

const SITE_ORIGIN = (process.env.SITE_ORIGIN ?? 'https://vespa-ui.github.io').replace(/\/+$/, '');
const SITE_BASE = process.env.SITE_BASE ?? '/vespa-ui/';
const SITE_URL = `${SITE_ORIGIN}/${SITE_BASE.replace(/^\/+|\/+$/g, '')}`.replace(/\/+$/, '');

// --- Minimal frontmatter parser, kept in sync with src/lib/frontmatter.ts ---
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { attributes: {}, body: raw };

  const attributes = {};
  for (const line of match[1].split(/\r?\n/)) {
    const lineMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    const value = rawValue.trim().replace(/^["']|["']$/g, '');
    attributes[key] = value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
  }
  return { attributes, body: raw.slice(match[0].length) };
}

// Kept in sync with src/lib/docs.ts
function stripOrderPrefix(segment) {
  const match = segment.match(/^(\d+)[-_.]?(.*)$/);
  if (match) return { name: match[2] || segment, order: Number(match[1]) };
  return { name: segment, order: Number.MAX_SAFE_INTEGER };
}

function titleCase(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function compareOrderPaths(a, b) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function collectDocs() {
  const files = walk(DOCS_DIR).sort();

  return files
    .map((file) => {
      const relPath = relative(DOCS_DIR, file).replace(/\.md$/, '');
      const segments = relPath.split('/');
      const fileSegment = segments.pop();
      const { name: fileName, order: fileOrder } = stripOrderPrefix(fileSegment);
      const folderOrders = segments.map((s) => stripOrderPrefix(s).order);
      const slugParts = segments.map((s) => stripOrderPrefix(s).name);
      slugParts.push(fileName);
      const slug = slugParts.join('/');

      const raw = readFileSync(file, 'utf8');
      const { attributes, body } = parseFrontmatter(raw);
      const order = typeof attributes.order === 'number' ? attributes.order : fileOrder;

      return {
        slug,
        title: attributes.title || titleCase(fileName),
        description: attributes.description,
        // Mirrors src/lib/docs.ts's per-folder hierarchical sort: order by
        // each path segment's NN- prefix (folders first, then the file),
        // not by the file's order alone — otherwise docs from different
        // folders interleave instead of grouping like the sidebar does.
        orderPath: [...folderOrders, order],
        body: body.trim(),
        lastmod: statSync(file).mtime.toISOString().slice(0, 10),
      };
    })
    .sort((a, b) => compareOrderPaths(a.orderPath, b.orderPath) || a.title.localeCompare(b.title));
}

function xmlEscape(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(docs) {
  const staticEntries = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/credits', changefreq: 'monthly', priority: '0.3' },
  ];
  const docEntries = docs.map((d) => ({
    loc: `/docs/${d.slug}`,
    lastmod: d.lastmod,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const urls = [...staticEntries, ...docEntries].map((e) => {
    const loc = e.loc === '/' ? `${SITE_URL}/` : `${SITE_URL}${e.loc}`;
    return [
      '  <url>',
      `    <loc>${xmlEscape(loc)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function buildLlmsTxt(docs) {
  const lines = [
    '# Vespa UI',
    '',
    '> Self-hosted admin console for Vespa — search, inspect, debug, and monitor Vespa clusters from a single web interface, with credentials kept server-side.',
    '',
    'Vespa UI is open source (Apache 2.0), built with NestJS, TypeORM, React, and Vite. It ships as a single Docker container with SQLite or PostgreSQL.',
    '',
    '## Docs',
    '',
  ];
  for (const d of docs) {
    const desc = d.description ? `: ${d.description}` : '';
    lines.push(`- [${d.title}](${SITE_URL}/docs-raw/${d.slug}.md)${desc}`);
  }
  lines.push(
    '',
    '## Optional',
    '',
    `- [About](${SITE_URL}/about): project background, design principles, monorepo layout`,
    `- [Credits](${SITE_URL}/credits): open-source dependencies and license`,
    `- [Full documentation, one file](${SITE_URL}/llms-full.txt): every doc page concatenated`,
    `- [GitHub repository](https://github.com/vespa-ui/vespa-ui): source code, issues, releases`,
    ''
  );
  return lines.join('\n');
}

function buildLlmsFullTxt(docs) {
  const parts = [
    '# Vespa UI — full documentation',
    '',
    '> Concatenated content of every page under /docs, for LLMs and agents that want the full corpus in one fetch.',
  ];
  for (const d of docs) {
    parts.push('', '---', '', `## ${d.title}`, '');
    if (d.description) parts.push(d.description, '');
    parts.push(d.body);
  }
  return parts.join('\n') + '\n';
}

function main() {
  const docs = collectDocs();

  mkdirSync(DOCS_OUT_DIR, { recursive: true });
  for (const d of docs) {
    const out = join(DOCS_OUT_DIR, `${d.slug}.md`);
    mkdirSync(dirname(out), { recursive: true });
    const header = `# ${d.title}\n\n${d.description ? d.description + '\n\n' : ''}`;
    writeFileSync(out, header + d.body + '\n');
  }

  writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), buildSitemap(docs));
  writeFileSync(join(PUBLIC_DIR, 'llms.txt'), buildLlmsTxt(docs));
  writeFileSync(join(PUBLIC_DIR, 'llms-full.txt'), buildLlmsFullTxt(docs));

  console.log(
    `Generated sitemap.xml, llms.txt, llms-full.txt, and ${docs.length} raw doc mirror(s) under public/docs-raw/.`
  );
}

main();
