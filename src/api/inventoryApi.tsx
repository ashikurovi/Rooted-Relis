import { fetchApi } from './baseApi';

export const getAllInventory = async () => {
  const res = await fetchApi('/inventory');
  return res.json();
};

export const getInventoryById = async (id: number | string) => {
  const res = await fetchApi(`/inventory/${id}`);
  return res.json();
};

export const getInventoryHistory = async (id: number | string) => {
  const res = await fetchApi(`/inventory/${id}/history`);
  return res.json();
};

export const createInventory = async (inventoryData: any) => {
  const res = await fetchApi('/inventory', {
    method: 'POST',
    body: JSON.stringify(inventoryData),
  });
  return res.json();
};

export const updateInventory = async (id: number | string, inventoryData: any) => {
  const res = await fetchApi(`/inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(inventoryData),
  });
  return res.json();
};

export const deleteInventory = async (id: number | string) => {
  const res = await fetchApi(`/inventory/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
