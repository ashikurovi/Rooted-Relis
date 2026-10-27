import { fetchApi } from './baseApi';

// Get all types
export const getAllTypes = async () => {
  const res = await fetchApi('/types');
  return res.json();
};

// Get a single type by ID
export const getTypeById = async (id: number | string) => {
  const res = await fetchApi(`/types/${id}`);
  return res.json();
};

// Create a new type
export const createType = async (typeData: any) => {
  const res = await fetchApi('/types', {
    method: 'POST',
    body: JSON.stringify(typeData),
  });
  return res.json();
};

// Update a type
export const updateType = async (id: number | string, typeData: any) => {
  const res = await fetchApi(`/types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(typeData),
  });
  return res.json();
};

// Delete a type
export const deleteType = async (id: number | string) => {
  const res = await fetchApi(`/types/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
