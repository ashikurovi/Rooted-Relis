import { fetchApi } from './baseApi';

export const getAllCosting = async () => {
  const res = await fetchApi('/costing');
  return res.json();
};

export const getCostingById = async (id: number | string) => {
  const res = await fetchApi(`/costing/${id}`);
  return res.json();
};

export const getCostingSummary = async () => {
  const res = await fetchApi('/costing/summary');
  return res.json();
};

export const createCosting = async (payload: any) => {
  const res = await fetchApi('/costing', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCosting = async (id: number | string, payload: any) => {
  const res = await fetchApi(`/costing/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteCosting = async (id: number | string) => {
  const res = await fetchApi(`/costing/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
