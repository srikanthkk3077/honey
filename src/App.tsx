import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { StoreProvider } from './store/store';
import { AppRoutes } from './routes/AppRoutes';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;
