import type { ReactNode } from 'react';

export default function PageContainer({
  children,
  maxWidth = 960,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return <div style={{ maxWidth, margin: '0 auto', padding: '56px 24px 96px' }}>{children}</div>;
}
