import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { EuiProvider } from '@elastic/eui';
import { EuiThemeBorealis } from '@elastic/eui-theme-borealis';
import 'highlight.js/styles/github-dark.css';
import App from './App';
import { euiThemeModifications } from './theme';
import { ColorModeProvider, useColorMode } from './colorMode';
import './styles/global.css';

const Root: React.FC = () => {
  const { colorMode } = useColorMode();
  return (
    <EuiProvider theme={EuiThemeBorealis} modify={euiThemeModifications} colorMode={colorMode}>
      {/* Real paths (not hash routes) so each page — especially /docs/* — gets
          its own crawlable, indexable URL. GitHub Pages has no server-side
          routing, so public/404.html + the inline script in index.html
          restore the intended path on first load (see README's SEO section). */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </EuiProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeProvider>
      <Root />
    </ColorModeProvider>
  </React.StrictMode>
);
