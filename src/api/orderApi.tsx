import { fetchApi } from './baseApi';

// Get all orders
export const getAllOrders = async () => {
  const res = await fetchApi('/orders');
  return res.json();
};

// Track an order by identifier
export const trackOrder = async (identifier: string) => {
  const res = await fetchApi(`/orders/track/${identifier}`);
  return res.json();
};

// Get a single order by ID
export const getOrderById = async (id: number | string) => {
  const res = await fetchApi(`/orders/${id}`);
  return res.json();
};

// Create a new order
export const createOrder = async (orderData: any) => {
  const res = await fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Update an order (general)
export const updateOrder = async (id: number | string, orderData: any) => {
  const res = await fetchApi(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(orderData),
  });
  return res.json();
};

// Update an order's status
export const updateOrderStatus = async (id: number | string, statusData: any) => {
  const res = await fetchApi(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  });
  return res.json();
};

// Delete an order
export const deleteOrder = async (id: number | string) => {
  const res = await fetchApi(`/orders/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
