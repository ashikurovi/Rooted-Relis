import { fetchApi } from './baseApi';

// Get all brands
export const getAllBrands = async () => {
  const res = await fetchApi('/brands');
  return res.json();
};

// Get a single brand by ID
export const getBrandById = async (id: number | string) => {
  const res = await fetchApi(`/brands/${id}`);
  return res.json();
};

// Create a new brand
export const createBrand = async (brandData: any | FormData) => {
  const isFormData = brandData instanceof FormData;
  const res = await fetchApi('/brands', {
    method: 'POST',
    body: isFormData ? brandData : JSON.stringify(brandData),
  });
  return res.json();
};

// Update a brand
export const updateBrand = async (id: number | string, brandData: any | FormData) => {
  const isFormData = brandData instanceof FormData;
  const res = await fetchApi(`/brands/${id}`, {
    method: 'PATCH',
    body: isFormData ? brandData : JSON.stringify(brandData),
  });
  return res.json();
};

// Delete a brand
export const deleteBrand = async (id: number | string) => {
  const res = await fetchApi(`/brands/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
