export interface ParsedMarkdown {
  attributes: Record<string, string | number>;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Minimal YAML-subset frontmatter parser (flat `key: value` pairs only).
 * Avoids pulling in a full YAML/gray-matter dependency for a handful of
 * scalar fields (title, order, section, description).
 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { attributes: {}, body: raw };
  }

  const attributes: Record<string, string | number> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const lineMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    const value = rawValue.trim().replace(/^["']|["']$/g, '');
    attributes[key] = value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
  }

  return { attributes, body: raw.slice(match[0].length) };
}
