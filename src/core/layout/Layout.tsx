import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="layout">
      {/* Header avec accessibilité */}
      <header className="app-header" role="banner">
        <h1>🤝 OMNIA Charity Tracking</h1>
        
        <nav className="main-nav" role="navigation" aria-label="Navigation principale">
          <ul>
            <li>
              <Link to="/dashboard" className="nav-link">
                Tableau de bord
              </Link>
            </li>
            <li>
              <Link to="/families" className="nav-link">
                Familles
              </Link>
            </li>
            <li>
              <Link to="/visits" className="nav-link">
                Visites
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          aria-label={`Activer ${darkMode ? 'le mode' : 'le mode sombre'}`}
          className="dark-mode-btn"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Contenu principal */}
      <main className="app-main" role="main">
        <Outlet />
      </main>

      {/* Skip link (accessibilité) */}
      <a href="#app-main" className="skip-link">
        Aller au contenu principal
      </a>
    </div>
  );
}