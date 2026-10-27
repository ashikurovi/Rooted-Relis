import { fetchApi } from './baseApi';

// Get all products
export const getAllProducts = async () => {
  const res = await fetchApi('/products');
  return res.json();
};

// Get a single product by ID
export const getProductById = async (id: number | string) => {
  const res = await fetchApi(`/products/${id}`);
  return res.json();
};

// Create a new product
export const createProduct = async (productData: any) => {
  const res = await fetchApi('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return res.json();
};

// Update a product
export const updateProduct = async (id: number | string, productData: any) => {
  const res = await fetchApi(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  });
  return res.json();
};

// Delete a product
export const deleteProduct = async (id: number | string) => {
  const res = await fetchApi(`/products/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
