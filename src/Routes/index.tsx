import React from 'react';
import App from './App';
import Landing from './Landing';
import IDO from './IDO';
import { HashRouter } from 'react-router-dom';

function Root() {
  const isApp = (): boolean => {
    return window.location.host.includes('app') && window.location.host !== 'app.otterclam.finance'; // TODO: remove this after launch
  };

  const isIDO = (): boolean => {
    return window.location.host.includes('ido');
  };

  if (isIDO()) {
    return <IDO />;
  }

  const app = () => (
    <HashRouter>
      <App />
    </HashRouter>
  );

  return isApp() ? app() : <Landing />;
}

export default Root;
