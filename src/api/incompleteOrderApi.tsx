import { fetchApi } from './baseApi';

export const getAllIncompleteOrders = async () => {
  const res = await fetchApi('/incomplete-orders');
  return res.json();
};

export const createIncompleteOrder = async (orderData: any) => {
  const res = await fetchApi('/incomplete-orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getIncompleteOrderById = async (id: number | string) => {
  const res = await fetchApi(`/incomplete-orders/${id}`);
  return res.json();
};

export const updateIncompleteOrder = async (id: number | string, updateData: any) => {
  const res = await fetchApi(`/incomplete-orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
  return res.json();
};

export const deleteIncompleteOrder = async (id: number | string) => {
  const res = await fetchApi(`/incomplete-orders/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
