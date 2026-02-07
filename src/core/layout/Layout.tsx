import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white dark:bg-gray-800 px-4 py-2 rounded" aria-label="Aller directement au contenu principal">
        Aller au contenu principal
      </a>
      <Header />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;