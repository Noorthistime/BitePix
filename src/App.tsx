import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConverterProvider } from './context/ConverterContext';
import { UploadZone } from './components/UploadZone';
import { ControlPanel } from './components/ControlPanel';
import { ResultCard } from './components/ResultCard';
import { AuthScreen } from './components/AuthScreen';
import { ProfileModal } from './components/ProfileModal';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

function AppContent() {
  const { isLoggedIn, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    const storedTheme = window.localStorage.getItem('bitepix-theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    window.localStorage.setItem('bitepix-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className='app-shell' data-theme={theme}>
      <div className='ambient ambient-left' aria-hidden='true' />
      <div className='ambient ambient-right' aria-hidden='true' />
      <div className='grid-overlay' aria-hidden='true' />

      <main className='app-content'>
        <header className='topbar'>
          <div className='brand-lockup'>
            <span className='brand-mark' aria-hidden='true' />
            <span className='brand-name'>BitePix</span>
          </div>

          <div className='topbar-actions'>
            <button
              type='button'
              className='profile-btn'
              onClick={() => setProfileOpen(true)}
              title='Open profile'
              aria-label='Open profile'
            >
              <span className='profile-btn-avatar'>
                {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </button>

            <button
              type='button'
              className='theme-toggle'
              onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              aria-label={'Switch to ' + nextTheme + ' mode'}
              title={'Switch to ' + nextTheme + ' mode'}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <motion.section className='hero' {...fadeIn}>
          <h1>Professional image conversion in a compact browser workspace.</h1>
          <p className='hero-copy'>
            Convert PNG, WebP, JPEG, and JPG files with precise format selection,
            adjustable sizing, and secure on-device processing.
          </p>
        </motion.section>

        <motion.section className='workspace-grid' {...fadeIn}>
          <UploadZone />
          <ControlPanel />
          <ResultCard />
        </motion.section>
      </main>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ConverterProvider>
        <AppContent />
      </ConverterProvider>
    </AuthProvider>
  );
}

export default App;
