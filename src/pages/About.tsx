import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiPanel,
  EuiSpacer,
  EuiStat,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import PageContainer from '../layout/PageContainer';
import Seo from '../components/Seo';

const STATS: { title: string; description: string }[] = [
  { title: 'Apache 2.0', description: 'License' },
  { title: 'Node 20+', description: 'Runtime' },
  { title: '3', description: 'Shared packages' },
  { title: '100%', description: 'TypeScript' },
];

const PRINCIPLES: { icon: string; title: string; body: string }[] = [
  {
    icon: 'lock',
    title: 'Credentials stay server-side',
    body: 'Vespa endpoints and secrets are proxied through the NestJS backend and never sent to the browser, so the UI can be exposed safely without leaking cluster access.',
  },
  {
    icon: 'cluster',
    title: 'Built for real operators',
    body: 'Every screen — the ranking debugger, the hybrid search comparator, the evaluation runner — mirrors a task Vespa operators actually do by hand today with curl and the Vespa CLI.',
  },
  {
    icon: 'package',
    title: 'One container, two databases',
    body: 'Ships as a single Docker image. SQLite is the zero-config default for trying it out; PostgreSQL is a `DATABASE_TYPE` away for production deployments.',
  },
];

export default function About() {
  return (
    <PageContainer>
      <Seo
        title="About"
        description="Vespa UI is a self-hosted admin console for Vespa — search, recommendation, and large-scale ranking — that replaces config files and curl commands with a modern web interface."
        path="/about"
      />
      <EuiTitle size="l">
        <h1>About Vespa UI</h1>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiText size="m" color="subdued" style={{ maxWidth: 720 }}>
        <p>
          Vespa is a powerful engine for search, recommendation, and large-scale ranking —
          but it&apos;s operated almost entirely through config files, curl commands, and the
          Vespa CLI. Vespa UI is a self-hosted admin console that puts those workflows behind a
          single, modern web interface.
        </p>
      </EuiText>

      <EuiSpacer size="xl" />

      <EuiFlexGrid columns={4} gutterSize="l">
        {STATS.map((stat) => (
          <EuiFlexItem key={stat.title}>
            <EuiPanel hasShadow={false} hasBorder>
              <EuiStat title={stat.title} description={stat.description} titleColor="success" />
            </EuiPanel>
          </EuiFlexItem>
        ))}
      </EuiFlexGrid>

      <EuiSpacer size="xxl" />

      <EuiTitle size="m">
        <h2>Design principles</h2>
      </EuiTitle>
      <EuiSpacer size="l" />

      <EuiFlexGroup direction="column" gutterSize="l">
        {PRINCIPLES.map((principle) => (
          <EuiFlexItem key={principle.title}>
            <EuiFlexGroup gutterSize="m" alignItems="flexStart">
              <EuiFlexItem grow={false}>
                <EuiIcon type={principle.icon} size="l" color="success" />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiTitle size="xs">
                  <h3>{principle.title}</h3>
                </EuiTitle>
                <EuiText size="s" color="subdued">
                  <p>{principle.body}</p>
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>

      <EuiHorizontalRule margin="xxl" />

      <EuiTitle size="m">
        <h2>Monorepo layout</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiText size="s" color="subdued">
        <p>pnpm workspaces + Turborepo, split into apps and shared packages:</p>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiPanel color="subdued" hasShadow={false} paddingSize="m">
        <pre className="vespaCodeBlock" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`apps/
  backend/          # NestJS API
  frontend/         # Vite + React app
packages/
  shared/           # Shared types & DTOs
  vespa-client/     # Vespa HTTP client
  components/       # Reusable UI components
docker/             # Docker entrypoint & config
docs/               # Additional documentation`}
        </pre>
      </EuiPanel>
    </PageContainer>
  );
}
