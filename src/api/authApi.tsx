import { fetchApi } from './baseApi';

export const loginUser = async (credentials: { email: string; password?: string }) => {
  const res = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  const response = await res.json();
  
  // Save token to localStorage if login is successful
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

export const logoutUser = () => {
  // Remove token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Optionally redirect to login page (e.g., window.location.href = '/login')
};

export const getProfile = async () => {
  const res = await fetchApi('/auth/profile');
  return res.json();
};
