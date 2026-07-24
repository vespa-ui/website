import {
  EuiAvatar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiListGroup,
  EuiListGroupItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import PageContainer from '../layout/PageContainer';
import Seo from '../components/Seo';

const DEPENDENCIES: { name: string; role: string; href: string }[] = [
  { name: 'Vespa', role: 'The search & ranking engine this project administers', href: 'https://vespa.ai/' },
  { name: 'Elastic UI (EUI)', role: 'Design system and component library used across this site and the app', href: 'https://eui.elastic.co/' },
  { name: 'NestJS', role: 'Backend API framework', href: 'https://nestjs.com/' },
  { name: 'TypeORM', role: 'Database ORM (SQLite / PostgreSQL)', href: 'https://typeorm.io/' },
  { name: 'React & Vite', role: 'Frontend framework and build tooling', href: 'https://react.dev/' },
  { name: 'Apache ECharts', role: 'Metrics and evaluation charting', href: 'https://echarts.apache.org/' },
  { name: 'TanStack Query', role: 'Server-state data fetching', href: 'https://tanstack.com/query' },
  { name: 'Zustand', role: 'Client-side state management', href: 'https://zustand-demo.pmnd.rs/' },
  { name: 'pnpm & Turborepo', role: 'Monorepo package management and task orchestration', href: 'https://turbo.build/' },
];

export default function Credits() {
  return (
    <PageContainer>
      <Seo
        title="Credits"
        description="The open-source projects Vespa UI is built on top of — Vespa, Elastic UI, NestJS, TypeORM, React, Vite, and more — plus license and support information."
        path="/credits"
      />
      <EuiTitle size="l">
        <h1>Credits</h1>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiText size="m" color="subdued" style={{ maxWidth: 720 }}>
        <p>Vespa UI is built on top of, and would not exist without, these open-source projects.</p>
      </EuiText>

      <EuiSpacer size="xl" />

      <EuiPanel hasBorder hasShadow={false}>
        <EuiListGroup>
          {DEPENDENCIES.map((dep) => (
            <EuiListGroupItem
              key={dep.name}
              icon={<EuiAvatar name={dep.name} size="s" color="#e7f9ee" />}
              label={
                <EuiFlexGroup direction="column" gutterSize="none">
                  <EuiFlexItem grow={false}>
                    <EuiLink href={dep.href} target="_blank" rel="noopener noreferrer">
                      {dep.name}
                    </EuiLink>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiText size="xs" color="subdued">
                      {dep.role}
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              }
            />
          ))}
        </EuiListGroup>
      </EuiPanel>

      <EuiSpacer size="xxl" />

      <EuiTitle size="m">
        <h2>License</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiText size="s" color="subdued">
        <p>
          Vespa UI is released under the{' '}
          <EuiLink
            href="https://github.com/vespa-ui/vespa-ui/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apache License 2.0
          </EuiLink>
          . Contributions are welcome — open an issue to discuss a change before submitting a
          large pull request.
        </p>
      </EuiText>

      <EuiSpacer size="xl" />

      <EuiTitle size="m">
        <h2>Support the project</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiText size="s" color="subdued">
        <p>
          If Vespa UI is useful to you, consider supporting its development via{' '}
          <EuiLink href="https://www.buymeacoffee.com/vespa.ui" target="_blank" rel="noopener noreferrer">
            Buy Me a Coffee
          </EuiLink>
          .
        </p>
      </EuiText>

      <EuiSpacer size="xl" />
      <EuiText size="xs" color="subdued">
        <p>Built with care for the Vespa community.</p>
      </EuiText>
    </PageContainer>
  );
}
