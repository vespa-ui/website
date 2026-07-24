import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import PageContainer from '../layout/PageContainer';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <PageContainer>
      <Seo title="Page not found" description="The page you're looking for doesn't exist or has moved." path="/404" noindex />
      <EuiEmptyPrompt
        iconType="minusInCircle"
        title={<h2>Page not found</h2>}
        body={<p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>}
        actions={
          <EuiButton href={import.meta.env.BASE_URL} color="success" fill>
            Back to home
          </EuiButton>
        }
      />
    </PageContainer>
  );
}
