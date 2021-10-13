import React from 'react';
import App from './App';
import Landing from './Landing';
import { HashRouter } from 'react-router-dom';

// FIXME: enable landing before deploy
// function Root() {
//   const isApp = (): boolean => {
//     return window.location.host.includes("app");
//   };

//   const app = () => (
//     <HashRouter>
//       <App />
//     </HashRouter>
//   );

//   return isApp() ? app() : <Landing />;
// }

function Root() {
  const app = () => (
    <HashRouter>
      <App />
    </HashRouter>
  );

  return app();
}

export default Root;
