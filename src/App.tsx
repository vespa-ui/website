import { Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Home';
import About from './pages/About';
import Credits from './pages/Credits';
import DocsLayout from './pages/docs/DocsLayout';
import DocsPage from './pages/docs/DocsPage';
import NotFound from './pages/NotFound';
import { getFirstDocSlug } from './lib/docs';

const firstDocSlug = getFirstDocSlug() ?? '';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocsPage redirectSlug={firstDocSlug} />} />
          <Route path="*" element={<DocsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}
