import { fetchApi } from './baseApi';

// Get all sizes
export const getAllSizes = async () => {
  const res = await fetchApi('/size');
  return res.json();
};

// Get a single size by ID
export const getSizeById = async (id: number | string) => {
  const res = await fetchApi(`/size/${id}`);
  return res.json();
};

// Create a new size
export const createSize = async (sizeData: any) => {
  const res = await fetchApi('/size', {
    method: 'POST',
    body: JSON.stringify(sizeData),
  });
  return res.json();
};

// Update a size
export const updateSize = async (id: number | string, sizeData: any) => {
  const res = await fetchApi(`/size/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(sizeData),
  });
  return res.json();
};

// Delete a size
export const deleteSize = async (id: number | string) => {
  const res = await fetchApi(`/size/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
