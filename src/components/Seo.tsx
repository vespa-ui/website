import { useEffect } from 'react';

export const SITE_NAME = 'Vespa UI';
// Origin the site is served from — used to build absolute canonical/OG URLs.
// Change this if you move to a custom domain (see README's SEO section).
export const SITE_ORIGIN = 'https://vespa-ui.github.io';

export interface SeoProps {
  /** Page title. Rendered as-is on the homepage, suffixed with " — Vespa UI" elsewhere. */
  title: string;
  description: string;
  /** Route path starting with "/", e.g. "/docs/getting-started/installation". */
  path: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  /** Optional structured data (schema.org) to inject as JSON-LD for this page. */
  jsonLd?: Record<string, unknown>;
}

function absoluteUrl(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/vespa-ui/" in prod, "/" in dev
  const cleanPath = path === '/' ? '' : path.replace(/^\//, '');
  return `${SITE_ORIGIN}${base}${cleanPath}`;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: Record<string, unknown> | undefined) {
  const existing = document.head.querySelector<HTMLScriptElement>(`script[data-seo-jsonld="${id}"]`);
  if (!data) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.createElement('script');
  el.setAttribute('type', 'application/ld+json');
  el.setAttribute('data-seo-jsonld', id);
  el.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(el);
}

/**
 * Sets document title, meta description/robots, canonical link, Open Graph /
 * Twitter card tags, and (optionally) a JSON-LD block for the current route.
 * Needed because this is a client-rendered SPA — there's no per-route server
 * response to attach different <head> content to otherwise.
 */
export default function Seo({ title, description, path, noindex, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = path === '/' ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    const canonical = absoluteUrl(path);
    setLink('canonical', canonical);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', absoluteUrl('/logo/logo.svg'));

    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', absoluteUrl('/logo/logo.svg'));

    setJsonLd('page', jsonLd);

    return () => {
      // Leave tags in place between route changes (next Seo call overwrites
      // them); only clear JSON-LD so a page without one doesn't inherit the
      // previous page's structured data.
      setJsonLd('page', undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, noindex, type, jsonLd]);

  return null;
}
