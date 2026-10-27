import { fetchApi } from './baseApi';

// Get all categories
export const getAllCategories = async () => {
  const res = await fetchApi('/category');
  return res.json();
};

// Get a single category by ID
export const getCategoryById = async (id: number | string) => {
  const res = await fetchApi(`/category/${id}`);
  return res.json();
};

// Create a new category
export const createCategory = async (categoryData: any | FormData) => {
  const isFormData = categoryData instanceof FormData;
  const res = await fetchApi('/category', {
    method: 'POST',
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
  return res.json();
};

// Update a category
export const updateCategory = async (id: number | string, categoryData: any | FormData) => {
  const isFormData = categoryData instanceof FormData;
  const res = await fetchApi(`/category/${id}`, {
    method: 'PATCH',
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
  return res.json();
};

// Delete a category
export const deleteCategory = async (id: number | string) => {
  const res = await fetchApi(`/category/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
