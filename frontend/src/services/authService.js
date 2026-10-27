import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    // Handle both wrapped ApiResponse and raw response
    const data = response.data?.data || response.data;
    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
    }
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network/server errors during logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
