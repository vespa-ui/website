import {
  EuiBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiCard,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { useColorMode } from '../colorMode';
import Seo from '../components/Seo';

const FEATURES: { icon: string; title: string; description: string }[] = [
  {
    icon: 'cluster',
    title: 'Cluster & connections',
    description:
      'Connect to and switch between multiple Vespa clusters with capability discovery, real-time health monitoring, and credentials encrypted server-side only.',
  },
  {
    icon: 'search',
    title: 'Search & ranking',
    description:
      'A visual query builder, a ranking debugger with per-document feature scores, and BM25 vs. vector vs. hybrid comparisons with overlap analysis.',
  },
  {
    icon: 'documents',
    title: 'Documents & schemas',
    description:
      'Full document CRUD with a modal editor, a read-only schema explorer, a visual schema editor, and Git-backed application package deployment.',
  },
  {
    icon: 'vector',
    title: 'Embeddings & evaluation',
    description:
      'Inspect tensor stats and similarity (cosine / dot / euclidean / manhattan), explore 2D projections, and score evaluation runs with NDCG, MAP, MRR, and F1.',
  },
  {
    icon: 'monitoringApp',
    title: 'Monitoring & operations',
    description:
      'Historical metrics with time-range queries and aggregation, an alerts system, background job tracking, and full audit logging.',
  },
  {
    icon: 'gear',
    title: 'Administration',
    description:
      'Organization / multi-tenant management, IP allowlisting, backups and retention policies, and a first-run setup wizard with JWT-based auth.',
  },
];

const STACK = [
  'NestJS',
  'TypeORM',
  'Passport / JWT',
  'React 18',
  'Vite',
  'Elastic UI',
  'Apache ECharts',
  'TanStack Query',
  'Zustand',
  'pnpm + Turborepo',
];

export default function Home() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Seo
        title="Vespa UI — Admin console for Vespa"
        description="Vespa UI is a modern, self-hosted administration platform for Vespa — search, inspect, debug, and monitor your clusters from a single web interface."
        path="/"
      />
      <section className={colorMode === 'light' ? 'vespaHero vespaHero--light' : 'vespaHero'}>
        <EuiFlexGroup
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ maxWidth: 860, margin: '0 auto', padding: '96px 24px 88px', textAlign: 'center' }}
          gutterSize="l"
        >
          <EuiFlexItem grow={false}>
            <EuiBadge color="#61D790" style={{ color: '#020202', fontWeight: 600 }}>
              Open source · Apache 2.0
            </EuiBadge>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size="l">
              <h1 style={{ color: 'inherit', fontSize: '2.75rem', lineHeight: 1.15 }}>
                The admin console <span style={{ color: '#61D790' }}>Vespa</span> doesn&apos;t ship
                with
              </h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText size="m" style={{ color: 'inherit', opacity: 0.85, maxWidth: 640 }}>
              <p>
                Search, inspect, debug, and monitor your Vespa clusters from a single self-hosted
                web interface — with every credential kept server-side, never exposed to the
                browser.
              </p>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="m">
              <EuiFlexItem grow={false}>
                <EuiButton href={`${import.meta.env.BASE_URL}docs`} fill color="success">
                  Read the docs
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty
                  href="https://github.com/vespa-ui/vespa-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  iconType="logoGithub"
                  color="text"
                  style={{ color: 'inherit' }}
                >
                  View on GitHub
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </section>

      <EuiPanel paddingSize="none" hasShadow={false} hasBorder={false} color="transparent">
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px' }}>
          <EuiFlexGroup direction="column" alignItems="center" style={{ textAlign: 'center' }}>
            <EuiFlexItem grow={false}>
              <EuiTitle size="m">
                <h2>Everything an operator needs, in one place</h2>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiText color="subdued" style={{ maxWidth: 640 }}>
                <p>
                  Vespa UI ships as a single Docker container with SQLite by default, or
                  PostgreSQL for production use.
                </p>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="xl" />

          <EuiFlexGrid columns={3} gutterSize="l">
            {FEATURES.map((feature) => (
              <EuiFlexItem key={feature.title}>
                <EuiCard
                  icon={<EuiIcon type={feature.icon} size="xl" color="success" />}
                  title={feature.title}
                  description={feature.description}
                  textAlign="left"
                  titleSize="xs"
                />
              </EuiFlexItem>
            ))}
          </EuiFlexGrid>
        </div>
      </EuiPanel>

      <EuiPanel paddingSize="none" hasShadow={false} hasBorder={false} color="subdued">
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 24px' }}>
          <EuiFlexGroup direction="column" alignItems="center" style={{ textAlign: 'center' }}>
            <EuiFlexItem grow={false}>
              <EuiTitle size="s">
                <h2>Built on a modern, fully typed stack</h2>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSpacer size="m" />
              <EuiFlexGroup wrap gutterSize="s" justifyContent="center">
                {STACK.map((tech) => (
                  <EuiFlexItem grow={false} key={tech}>
                    <EuiBadge color="hollow">{tech}</EuiBadge>
                  </EuiFlexItem>
                ))}
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </EuiPanel>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 96px' }}>
        <EuiPanel color="success" paddingSize="l" hasShadow={false}>
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" wrap gutterSize="m">
            <EuiFlexItem grow={false}>
              <EuiTitle size="s">
                <h3>Ready to try it on your cluster?</h3>
              </EuiTitle>
              <EuiText size="s">
                <p>Spin it up with Docker Compose and complete the setup wizard in under a minute.</p>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton href={`${import.meta.env.BASE_URL}docs`} fill>
                Get started
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </div>
    </>
  );
}
