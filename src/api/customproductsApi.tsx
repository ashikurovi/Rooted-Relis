import { fetchApi } from './baseApi';

export const getAllCustomProducts = async () => {
  const res = await fetchApi('/custom-products');
  return res.json();
};

export const getCustomProductById = async (id: number | string) => {
  const res = await fetchApi(`/custom-products/${id}`);
  return res.json();
};

export const createCustomProduct = async (productData: any) => {
  const res = await fetchApi('/custom-products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const updateCustomProduct = async (id: number | string, productData: any) => {
  const res = await fetchApi(`/custom-products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const deleteCustomProduct = async (id: number | string) => {
  const res = await fetchApi(`/custom-products/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};