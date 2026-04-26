import { api } from './api';

const TOKEN_KEY = 'jurisfile_token';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', { email, password });
    // Save token to localStorage
    console.log(response);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response;
  },

  async getMe() {
    return api.get('/api/auth/me');
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
