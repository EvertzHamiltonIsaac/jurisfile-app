// Base API client
// Every service uses this instead of calling fetch directly.
// It automatically injects the JWT token on every request
// and handles common errors in one place.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('jurisfile_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  // Token expired or invalid → force logout
  if (response.status === 401) {
    localStorage.removeItem('jurisfile_token');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    // Throw the API error message so services can catch it
    throw new Error(data.message || 'An unexpected error occurred.');
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
