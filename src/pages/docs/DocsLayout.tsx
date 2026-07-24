import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { EuiFlexGroup, EuiFlexItem, EuiSideNav, type EuiSideNavItemType } from '@elastic/eui';
import { getDocsRoot, type DocPage, type DocSection } from '../../lib/docs';

export default function DocsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const activeSlug = params['*'] ?? '';

  const navItems = useMemo(() => {
    const root = getDocsRoot();

    const pageToItem = (page: DocPage): EuiSideNavItemType<{}> => ({
      id: page.slug,
      name: page.title,
      isSelected: page.slug === activeSlug,
      onClick: () => navigate(`/docs/${page.slug}`),
    });

    const sectionToItem = (section: DocSection, path: string): EuiSideNavItemType<{}> => ({
      id: path,
      name: section.title,
      items: [...section.items.map(pageToItem), ...section.children.map((c) => sectionToItem(c, `${path}/${c.key}`))],
    });

    // EuiSideNav always renders depth-0 items expanded; nesting everything one
    // level deeper under a single root is what makes the folder sections below
    // actually collapsible (EuiSideNav only supports click-to-toggle at depth > 0).
    return [
      {
        id: 'docs-root',
        name: 'Documentation',
        items: [
          ...root.items.map(pageToItem),
          ...root.children.map((section) => sectionToItem(section, section.key)),
        ],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, navigate]);

  return (
    <EuiFlexGroup
      gutterSize="none"
      style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 96px', alignItems: 'flex-start' }}
    >
      <EuiFlexItem grow={false} style={{ width: 260, position: 'sticky', top: 64 }}>
        <EuiSideNav items={navItems} mobileTitle="Documentation menu" key={location.pathname} />
      </EuiFlexItem>
      <EuiFlexItem style={{ paddingLeft: 40, minWidth: 0 }}>
        <Outlet />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
