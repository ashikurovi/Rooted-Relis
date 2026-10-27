import { fetchApi } from './baseApi';

export const getAnalyticsData = async () => {
  const res = await fetchApi('/analytics');
  if (!res.ok) {
    throw new Error('Failed to load analytics data');
  }
  return res.json();
};
