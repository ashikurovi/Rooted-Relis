import { fetchApi } from './baseApi';

export const getDashboardData = async () => {
  const res = await fetchApi('/dashboard');
  if (!res.ok) {
    throw new Error('Failed to load dashboard data');
  }
  return res.json();
};
