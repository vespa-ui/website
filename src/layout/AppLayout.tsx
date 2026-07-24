import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  EuiHeader,
  EuiHeaderLinks,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiToolTip,
} from '@elastic/eui';
import { useColorMode } from '../colorMode';
import { brand } from '../theme';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Docs', href: '/docs' },
  { label: 'Credits', href: '/credits' },
];

// EUI's header link/icon colors are computed from the `theme`/colorMode
// context, which doesn't give us a text color that stays readable on a
// solid brand-green bar in every mode — so link/icon colors here are set
// explicitly to the brand ink instead of relying on EUI's theme system.
export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <EuiHeader position="fixed" theme="default" style={{ background: brand.green }}>
        <EuiHeaderSectionItem>
          <Link
            to="/"
            aria-label="Vespa UI"
            style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}logo/logo.svg`}
              alt="Vespa UI"
              style={{ height: 22, width: 'auto', display: 'block' }}
            />
          </Link>
        </EuiHeaderSectionItem>

        <EuiHeaderSectionItem>
          <EuiHeaderLinks aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const path = item.href;
              const isActive =
                path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    color: brand.ink,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    padding: '7px 14px',
                    margin: '0 2px',
                    borderRadius: 6,
                    background: isActive ? 'rgba(2, 2, 2, 0.14)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </EuiHeaderLinks>
        </EuiHeaderSectionItem>

        <EuiHeaderSection side="right">
          <EuiHeaderSectionItem>
            <EuiToolTip content={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <EuiHeaderSectionItemButton aria-label="Toggle color mode" onClick={toggleColorMode}>
                <EuiIcon type={colorMode === 'light' ? 'moon' : 'sun'} size="m" color={brand.ink} />
              </EuiHeaderSectionItemButton>
            </EuiToolTip>
          </EuiHeaderSectionItem>

          <EuiHeaderSectionItem>
            <EuiToolTip content="View source on GitHub">
              <EuiHeaderSectionItemButton
                aria-label="View source on GitHub"
                href="https://github.com/vespa-ui/vespa-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <EuiIcon type="logoGithub" size="m" color={brand.ink} />
              </EuiHeaderSectionItemButton>
            </EuiToolTip>
          </EuiHeaderSectionItem>
        </EuiHeaderSection>
      </EuiHeader>

      <div style={{ paddingTop: 48, minHeight: '100vh' }}>{children}</div>
    </>
  );
}
