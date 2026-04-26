import { useState, useEffect } from 'react';
import { authService } from '../services/Auth.service';
import { AuthContext } from './useAuth';

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
