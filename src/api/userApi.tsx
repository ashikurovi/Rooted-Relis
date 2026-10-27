import { fetchApi, BASE_URL } from './baseApi';

// Get all users
export const getAllUsers = async () => {
  const res = await fetchApi('/users');
  return res.json();
};

// Get a single user by ID
export const getUserById = async (id: number | string) => {
  const res = await fetchApi(`/users/${id}`);
  return res.json();
};

// Create a new user (handles FormData for picture uploads)
export const createUser = async (userData: any | FormData) => {
  const isFormData = userData instanceof FormData;
  const res = await fetchApi('/users', {
    method: 'POST',
    body: isFormData ? userData : JSON.stringify(userData),
  });
  return res.json();
};

// Update a user (handles FormData for picture uploads)
export const updateUser = async (id: number | string, userData: any | FormData) => {
  const isFormData = userData instanceof FormData;
  const res = await fetchApi(`/users/${id}`, {
    method: 'PATCH',
    body: isFormData ? userData : JSON.stringify(userData),
  });
  return res.json();
};

// Delete a user
export const deleteUser = async (id: number | string) => {
  const res = await fetchApi(`/users/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

// Ban or unban a user
export const banUser = async (id: number | string, isBanned: boolean) => {
  const res = await fetchApi(`/users/${id}/ban`, {
    method: 'PATCH',
    body: JSON.stringify({ isBanned }),
  });
  return res.json();
};
