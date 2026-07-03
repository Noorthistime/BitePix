import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

function AuthScreenComponent() {
  const { authView, setAuthView, login, signup } = useAuth();

  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    if (!loginName || !loginPassword) {
      setLoginError('Please fill in both fields.');
      return;
    }
    setLoginLoading(true);
    const result = await login(loginName, loginPassword);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.error ?? 'Login failed.');
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setSignupError('');
    if (!signupName || !signupPassword) {
      setSignupError('Please fill in both fields.');
      return;
    }
    setSignupLoading(true);
    const result = await signup(signupName, signupPassword);
    setSignupLoading(false);
    if (!result.success) {
      setSignupError(result.error ?? 'Signup failed.');
    }
  };

  const switchView = (view: 'login' | 'signup') => {
    setAuthView(view);
    setLoginError('');
    setSignupError('');
  };

  return (
    <motion.div className="auth-shell" {...fadeIn}>
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <main className="auth-content">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="auth-title">BitePix</span>
        </div>

        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={'auth-tab ' + (authView === 'login' ? 'auth-tab-active' : '')}
              onClick={() => switchView('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={'auth-tab ' + (authView === 'signup' ? 'auth-tab-active' : '')}
              onClick={() => switchView('signup')}
            >
              Sign up
            </button>
          </div>

          {authView === 'login' ? (
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <h2 className="auth-heading">Welcome back</h2>
              <p className="muted auth-desc">Login to continue using BitePix.</p>

              <label className="field">
                <span className="field-label">Username</span>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Enter your username"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  autoFocus
                />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <div className="password-input-wrap">
                <input
                  className="auth-input"
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowLoginPw(!showLoginPw)}
                  aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showLoginPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
              </label>

              {loginError ? <p className="auth-error">{loginError}</p> : null}

              <button
                type="submit"
                className="primary-button auth-submit"
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                Don't have an account, <span onClick={() => switchView('signup')} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Sign up</span>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignup} noValidate>
              <h2 className="auth-heading">Create your account</h2>
              <p className="muted auth-desc">Join BitePix to start converting images.</p>

              <label className="field">
                <span className="field-label">Username</span>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Choose a username"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  autoFocus
                />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <div className="password-input-wrap">
                <input
                  className="auth-input"
                  type={showSignupPw ? 'text' : 'password'}
                  placeholder="Choose a password (min. 4 characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowSignupPw(!showSignupPw)}
                  aria-label={showSignupPw ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showSignupPw ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
              </label>

              {signupError ? <p className="auth-error">{signupError}</p> : null}

              <button
                type="submit"
                className="primary-button auth-submit"
                disabled={signupLoading}
              >
                {signupLoading ? 'Signing up...' : 'Sign up'}
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#a0a0a0' }}>
                Already have an account, <span onClick={() => switchView('login')} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Login</span>
              </p>
            </form>
          )}
        </div>

        <p className="auth-footer-text">
          Secure on-device processing &middot; No data leaves your browser
        </p>
      </main>
    </motion.div>
  );
}

export const AuthScreen = memo(AuthScreenComponent);
