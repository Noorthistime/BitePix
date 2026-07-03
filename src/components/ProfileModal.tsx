import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProfileModalComponent({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPwFields, setShowPwFields] = useState(false);
  const [showPwText, setShowPwText] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName);
      setCurrentPassword('');
      setNewPassword('');
      setProfileMsg('');
      setProfileError('');
      setPasswordMsg('');
      setPasswordError('');
      setShowPwFields(false);
    }
  }, [isOpen, user]);

  if (!user) return null;

  const handleProfileUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    setProfileMsg('');
    setProfileError('');
    if (!displayName || displayName.trim().length < 2) {
      setProfileError('Display name must be at least 2 characters.');
      return;
    }
    updateProfile(displayName.trim());
    setProfileMsg('Profile updated successfully.');
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    const result = await changePassword(currentPassword, newPassword);
    if (result.success) {
      setPasswordMsg('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setShowPwFields(false);
    } else {
      setPasswordError(result.error ?? 'Password change failed.');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="profile-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <div className="profile-modal-header">
              <h2 id="profile-modal-title">Profile</h2>
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close profile"
              >
                &times;
              </button>
            </div>

            <div className="profile-user-info">
              <div className="profile-avatar">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="profile-user-name">{user.displayName}</p>
              </div>
            </div>

            <form className="profile-section" onSubmit={handleProfileUpdate}>
              <h3 className="profile-section-title">Display Name</h3>
              <label className="field">
                <input
                  className="auth-input"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </label>
              {profileMsg ? <p className="profile-success">{profileMsg}</p> : null}
              {profileError ? <p className="auth-error">{profileError}</p> : null}
            </form>

            <div className="profile-section" style={{ marginBottom: '1rem' }}>
              <h3 className="profile-section-title">Password</h3>
              <div className="password-input-wrap">
                <input
                  className="auth-input"
                  type={showPwText ? 'text' : 'password'}
                  value={user.password}
                  readOnly
                  tabIndex={-1}
                />
                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowPwText(!showPwText)}
                  aria-label={showPwText ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPwText ? (
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
            </div>

            <div className="profile-divider" />

            {!showPwFields ? (
              <button
                type="button"
                className="ghost-button"
                style={{ width: '100%', marginBottom: '0.5rem' }}
                onClick={() => setShowPwFields(true)}
              >
                Change Password
              </button>
            ) : (
              <form className="profile-section" onSubmit={handlePasswordChange}>
                <h3 className="profile-section-title">Change Password</h3>
                <label className="field">
                  <span className="field-label">Current Password</span>
                  <div className="password-input-wrap">
                    <input
                      className="auth-input"
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-eye-btn"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      aria-label={showCurrentPw ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showCurrentPw ? (
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
                <label className="field">
                  <span className="field-label">New Password</span>
                  <div className="password-input-wrap">
                    <input
                      className="auth-input"
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-eye-btn"
                      onClick={() => setShowNewPw(!showNewPw)}
                      aria-label={showNewPw ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showNewPw ? (
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
                {passwordMsg ? <p className="profile-success">{passwordMsg}</p> : null}
                {passwordError ? <p className="auth-error">{passwordError}</p> : null}
                <button type="submit" className="primary-button" style={{ width: '100%' }}>
                    Save
                  </button>
              </form>
            )}

            <div className="profile-divider" />

            <button
              type="button"
              className="ghost-button profile-logout"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const ProfileModal = memo(ProfileModalComponent);
