import React from 'react';
import App from './App';
import Landing from './Landing';
import { HashRouter } from 'react-router-dom';

function Root() {
  const isApp = (): boolean => {
    return window.location.host.includes('app') && window.location.host !== 'app.otterclam.finance'; // TODO: remove this after launch
  };

  const app = () => (
    <HashRouter>
      <App />
    </HashRouter>
  );

  return isApp() ? app() : <Landing />;
}

export default Root;
