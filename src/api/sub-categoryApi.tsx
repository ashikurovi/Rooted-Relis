import { fetchApi } from './baseApi';

// Get all sub-categories
export const getAllSubCategories = async () => {
  const res = await fetchApi('/sub-category');
  return res.json();
};

// Get a single sub-category by ID
export const getSubCategoryById = async (id: number | string) => {
  const res = await fetchApi(`/sub-category/${id}`);
  return res.json();
};

// Create a new sub-category
export const createSubCategory = async (subCategoryData: any | FormData) => {
  const isFormData = subCategoryData instanceof FormData;
  const res = await fetchApi('/sub-category', {
    method: 'POST',
    body: isFormData ? subCategoryData : JSON.stringify(subCategoryData),
  });
  return res.json();
};

// Update a sub-category
export const updateSubCategory = async (id: number | string, subCategoryData: any | FormData) => {
  const isFormData = subCategoryData instanceof FormData;
  const res = await fetchApi(`/sub-category/${id}`, {
    method: 'PATCH',
    body: isFormData ? subCategoryData : JSON.stringify(subCategoryData),
  });
  return res.json();
};

// Delete a sub-category
export const deleteSubCategory = async (id: number | string) => {
  const res = await fetchApi(`/sub-category/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
