import { fetchApi } from './baseApi';

// Get all custom orders
export const getAllCustomOrders = async () => {
  const res = await fetchApi('/custom-orders');
  return res.json();
};

// Get a single custom order by ID
export const getCustomOrderById = async (id: number | string) => {
  const res = await fetchApi(`/custom-orders/${id}`);
  return res.json();
};

// Create a new custom order
export const createCustomOrder = async (orderData: any) => {
  const res = await fetchApi('/custom-orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Update a custom order
export const updateCustomOrder = async (id: number | string, orderData: any) => {
  const res = await fetchApi(`/custom-orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Delete a custom order
export const deleteCustomOrder = async (id: number | string) => {
  const res = await fetchApi(`/custom-orders/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
