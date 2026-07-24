import type { AnchorHTMLAttributes } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import { EuiEmptyPrompt, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import { findDocPage } from '../../lib/docs';
import Seo, { SITE_NAME, SITE_ORIGIN } from '../../components/Seo';

// Renders site-relative Markdown links (e.g. "/docs/getting-started/installation")
// as React Router `Link`s so they navigate client-side instead of doing a full
// page reload; external/absolute links pass through as plain anchors.
function MarkdownLink({ href, children }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href && href.startsWith('/')) {
    return <Link to={href}>{children}</Link>;
  }
  const isExternal = /^https?:\/\//.test(href ?? '');
  return (
    <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
}

export default function DocsPage({ redirectSlug }: { redirectSlug?: string }) {
  const params = useParams();
  const slug = params['*'] ?? '';

  if (redirectSlug !== undefined) {
    if (!redirectSlug) {
      return (
        <EuiEmptyPrompt
          iconType="documentation"
          title={<h2>No docs published yet</h2>}
          body={
            <p>
              Add a Markdown file under <code>website/src/content/docs/</code> and it will show
              up here automatically.
            </p>
          }
        />
      );
    }
    return <Navigate to={`/docs/${redirectSlug}`} replace />;
  }

  const page = findDocPage(slug);

  if (!page) {
    return (
      <>
        <Seo title="Doc not found" description="There is no documentation page at this address." path={`/docs/${slug}`} noindex />
        <EuiEmptyPrompt
          iconType="alert"
          title={<h2>Doc not found</h2>}
          body={<p>There is no documentation page at &quot;{slug}&quot;.</p>}
        />
      </>
    );
  }

  const base = import.meta.env.BASE_URL;
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_ORIGIN}${base}` },
      { '@type': 'ListItem', position: 2, name: 'Docs', item: `${SITE_ORIGIN}${base}docs` },
      { '@type': 'ListItem', position: 3, name: page.title, item: `${SITE_ORIGIN}${base}docs/${page.slug}` },
    ],
  };

  return (
    <article>
      <Seo
        title={page.title}
        description={page.description ?? `${page.title} — Vespa UI documentation.`}
        path={`/docs/${page.slug}`}
        type="article"
        jsonLd={breadcrumbJsonLd}
      />
      <EuiTitle size="l">
        <h1>{page.title}</h1>
      </EuiTitle>
      {page.description && (
        <>
          <EuiSpacer size="s" />
          <EuiText color="subdued">
            <p>{page.description}</p>
          </EuiText>
        </>
      )}
      <EuiSpacer size="l" />
      <EuiText className="vespaMarkdown" grow={false}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeHighlight]}
          components={{ a: MarkdownLink }}
        >
          {page.body}
        </ReactMarkdown>
      </EuiText>
    </article>
  );
}
