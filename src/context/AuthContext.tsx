import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export interface BitePixUser {
  userId: string;
  displayName: string;
  password: string;
}

interface AuthContextValue {
  user: BitePixUser | null;
  isLoggedIn: boolean;
  authView: 'login' | 'signup';
  setAuthView: (view: 'login' | 'signup') => void;
  login: (displayName: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (displayName: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (displayName: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AUTH_STORAGE_KEY = 'bitepix_user';

function loadUser(): BitePixUser | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as BitePixUser;
    }
  } catch {
  }
  return null;
}

function saveUser(user: BitePixUser): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

function clearUser(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function generateId(): string {
  const now = Date.now();
  const rnd = Math.random().toString(36).slice(2, 9);
  return 'user_' + now + '_' + rnd;
}

function getAllUsers(): BitePixUser[] {
  try {
    const raw = window.localStorage.getItem('bitepix_users');
    return raw ? (JSON.parse(raw) as BitePixUser[]) : [];
  } catch {
    return [];
  }
}

function saveAllUsers(users: BitePixUser[]): void {
  window.localStorage.setItem('bitepix_users', JSON.stringify(users));
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<BitePixUser | null>(() => loadUser());
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  const login = useCallback(
    async (displayName: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getAllUsers();
      const found = users.find((u) => u.displayName === displayName);

      if (!found) {
        return { success: false, error: 'User not found. Please check your username.' };
      }

      if (found.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      setUser(found);
      saveUser(found);
      return { success: true };
    },
    []
  );

  const signup = useCallback(
    async (displayName: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const users = getAllUsers();
      const exists = users.some((u) => u.displayName === displayName);

      if (exists) {
        return { success: false, error: 'Username already exists. Please choose another.' };
      }

      if (!displayName || displayName.trim().length < 2) {
        return { success: false, error: 'Username must be at least 2 characters.' };
      }

      if (!password || password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters.' };
      }

      const newUser: BitePixUser = {
        userId: generateId(),
        displayName: displayName.trim(),
        password,
      };

      const updated = [...users, newUser];
      saveAllUsers(updated);

      setUser(newUser);
      saveUser(newUser);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    clearUser();
  }, []);

  const updateProfile = useCallback(
    (displayName: string) => {
      if (!user) return;

      const updated: BitePixUser = { ...user, displayName };

      const users = getAllUsers();
      const idx = users.findIndex((u) => u.userId === user.userId);
      if (idx >= 0) {
        users[idx] = updated;
        saveAllUsers(users);
      }

      setUser(updated);
      saveUser(updated);
    },
    [user]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: 'No user logged in.' };
      }

      if (user.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect.' };
      }

      if (!newPassword || newPassword.length < 4) {
        return { success: false, error: 'New password must be at least 4 characters.' };
      }

      const updated: BitePixUser = { ...user, password: newPassword };

      const users = getAllUsers();
      const idx = users.findIndex((u) => u.userId === user.userId);
      if (idx >= 0) {
        users[idx] = updated;
        saveAllUsers(users);
      }

      setUser(updated);
      saveUser(updated);
      return { success: true };
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: user !== null,
      authView,
      setAuthView,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, authView, login, signup, logout, updateProfile, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
