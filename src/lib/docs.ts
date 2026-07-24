import { parseFrontmatter } from './frontmatter';

export interface DocHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface DocPage {
  /** Route slug, e.g. "getting-started/installation" */
  slug: string;
  title: string;
  description?: string;
  order: number;
  body: string;
  headings: DocHeading[];
}

export interface DocSection {
  key: string;
  title: string;
  order: number;
  items: DocPage[];
  children: DocSection[];
}

/**
 * Markdown files under `src/content/docs/**` are picked up automatically —
 * committing a new `.md` file there adds it to the docs site and the sidebar
 * with no other code changes. File/folder names may be prefixed with
 * `NN-` to control ordering (e.g. `01-introduction.md`); the prefix is
 * stripped from the generated slug and title. Optional frontmatter:
 *
 * ---
 * title: Custom Title
 * order: 1
 * description: Short summary shown in the page header.
 * ---
 */
const rawModules = import.meta.glob('/src/content/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function stripOrderPrefix(segment: string): { name: string; order: number } {
  const match = segment.match(/^(\d+)[-_.]?(.*)$/);
  if (match) {
    return { name: match[2] || segment, order: Number(match[1]) };
  }
  return { name: segment, order: Number.MAX_SAFE_INTEGER };
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractHeadings(body: string): DocHeading[] {
  const headings: DocHeading[] = [];
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    const depth = m[1].length as 2 | 3;
    const text = m[2].replace(/[`*_]/g, '').trim();
    headings.push({ depth, text, id: slugify(text) });
  }
  return headings;
}

function buildRoot(): DocSection {
  const root: DocSection = { key: '', title: '', order: 0, items: [], children: [] };

  const paths = Object.keys(rawModules).sort();

  for (const path of paths) {
    const relative = path.replace(/^\/src\/content\/docs\//, '').replace(/\.md$/, '');
    const segments = relative.split('/');
    const fileSegment = segments.pop()!;
    const { name: fileName, order: fileOrder } = stripOrderPrefix(fileSegment);

    const { attributes, body } = parseFrontmatter(rawModules[path]);

    let cursor = root;
    const slugParts: string[] = [];
    for (const rawSegment of segments) {
      const { name, order } = stripOrderPrefix(rawSegment);
      slugParts.push(name);
      let next = cursor.children.find((c) => c.key === name);
      if (!next) {
        next = { key: name, title: titleCase(name), order, items: [], children: [] };
        cursor.children.push(next);
      }
      cursor = next;
    }

    slugParts.push(fileName);
    const page: DocPage = {
      slug: slugParts.join('/'),
      title: (attributes.title as string) || titleCase(fileName),
      description: attributes.description as string | undefined,
      order: typeof attributes.order === 'number' ? attributes.order : fileOrder,
      body,
      headings: extractHeadings(body),
    };
    cursor.items.push(page);
  }

  const sortTree = (section: DocSection) => {
    section.items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    section.children.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    section.children.forEach(sortTree);
  };
  sortTree(root);

  return root;
}

let cachedRoot: DocSection | null = null;

/** The synthetic root section: `items` are loose top-level docs (no folder), `children` are sections (one per folder). */
export function getDocsRoot(): DocSection {
  if (!cachedRoot) cachedRoot = buildRoot();
  return cachedRoot;
}

export function getFirstDocSlug(): string | undefined {
  const root = getDocsRoot();
  if (root.items[0]) return root.items[0].slug;
  const walk = (section: DocSection): string | undefined => {
    if (section.items[0]) return section.items[0].slug;
    for (const child of section.children) {
      const found = walk(child);
      if (found) return found;
    }
    return undefined;
  };
  for (const child of root.children) {
    const found = walk(child);
    if (found) return found;
  }
  return undefined;
}

export function findDocPage(slug: string): DocPage | undefined {
  const walk = (section: DocSection): DocPage | undefined => {
    const found = section.items.find((item) => item.slug === slug);
    if (found) return found;
    for (const child of section.children) {
      const nested = walk(child);
      if (nested) return nested;
    }
    return undefined;
  };
  return walk(getDocsRoot());
}
