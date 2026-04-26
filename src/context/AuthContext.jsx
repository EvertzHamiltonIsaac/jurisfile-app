import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/Auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore session if token exists
  useEffect(() => {
    async function restoreSession() {
      if (!authService.isAuthenticated()) {
        setLoading(false);
        return;
      }
      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch {
        // Token invalid or expired — clear it
        authService.logout();
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    await authService.login(email, password);
    const response = await authService.getMe();
    setUser(response.data);
  }

  function logout() {
    setUser(null);
    authService.logout();
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

// Custom hook — use this in any component that needs auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
